import express from 'express'
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import helmet from 'helmet';
import { prefix } from './../config/index.js';
import routes from './../api/routes/index.js';
import { rateLimiter } from '../api/middlewares/index.js';
import { jwtSecretKey } from '../config/index.js';
import bodyParser from 'body-parser';
import NodeCache from "node-cache";
import { Image, Video } from "../models/index.js";
import { mongo, Mongoose, Types } from 'mongoose';

export default (app) => {
  process.on('uncaughtException', async (error) => {
    // console.log(error);
  });

  process.on('unhandledRejection', async (ex) => {
    // console.log(ex);
  });

  if (!jwtSecretKey) {
    process.exit(1);
  }

  app.enable('trust proxy');

  const corsOptions = {
    origin: 'https://brandedact.online'
  };
  app.use(cors(corsOptions));
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(morgan('dev'));
  app.use(helmet());
  app.use(compression());
  app.use(express.static('public'));
  app.disable('x-powered-by');
  app.disable('etag');

  // app.use(rateLimiter);

  var trigger = false;

  app.get("/api/qr/check", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    console.log(['trigger status', trigger])
    res.json({
      status: trigger,
    });
  });

  app.get("/api/qr/set", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    trigger = true;
    console.log(['trigger set true', trigger])
    res.json({
      status: trigger,
    });
  });

  app.get("/api/qr/reset", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    trigger = false;
    console.log(['trigger set false', trigger])
    res.json({
      status: trigger,
    });
  });


  // app.use(prefix, routes);
  const cache = new NodeCache({ stdTTL: 15, deleteOnExpire: false });

  const LOOP_LAST_THRESHOLD = 9;
  var db_counter = 0;
  var passive_cache_list = [];
  var showOnlyInStageScreen = [0];

  const setCache = async () => {
    try {
      console.time('setCache')
      const list = await Video.find({});
      console.log(['db Video count', list.length])

      db_counter = list.length == 0 ? 0 : list.length - 1;
      for (let i = 0; i < list.length; i++) {
        var video = list[i];
        if (video?.active) {
          if (`${video.data}`.includes('quicktime')) {
            video.data = `${video.data}`.replace('quicktime', 'mp4');
          }

          let strData = JSON.stringify(video);
          cache.set(i, strData);
        } else {
          passive_cache_list.push(i);
        }
      }
      console.timeEnd('setCache')
    } catch (error) {
      console.error(['setCache', error]);
    }
    return true;
  }

  const verifyCache = async (req, res, next) => {
    try {
      console.log(['verifyCache', req.body.skip])

      const client_image_count = req.body.skip;
      const hasCache = cache.has(`${client_image_count}`);
      if (hasCache) {
        const vid = cache.get(`${client_image_count}`);
        let video = JSON.parse(vid);
        // console.log(['cache.get', video])
        // video = new Video({
        //   data: vid,
        // })
        res.send({
          status: true,
          hasNext: true,
          video: video,
          count: client_image_count + 1,
        });
        res.end();
      } else {
        console.log(["cache'te yok", req.body.skip]);
        return next();
      }

    } catch (err) {
      console.error(['verifyCache', err]);
      let startWith = 0;
      if (db_counter > LOOP_LAST_THRESHOLD) {
        startWith = db_counter - LOOP_LAST_THRESHOLD;
      }
      res.send({
        status: false,
        hasNext: false,
        video: {},
        count: startWith,
      });
      res.end();
    }
  };

  const verifyCacheSelected = async (req, res, next) => {
    try {
      console.log(['verifyCacheSelected', req.body.skip])
      const client_image_count = req.body.skip;
      let selectedSkipNo = showOnlyInStageScreen.indexOf(client_image_count);
      const hasCache = cache.has(`${client_image_count}`);
      if (hasCache) {
        const vid = cache.get(`${client_image_count}`);
        let video = JSON.parse(vid);
        // console.log(['cache.get', video])
        // video = new Video({
        //   data: vid,
        // })
        let nextSkipNo = showOnlyInStageScreen[selectedSkipNo + 1];
        if (!nextSkipNo) {
          nextSkipNo = showOnlyInStageScreen[0];
        }
        res.send({
          status: true,
          hasNext: true,
          video: video,
          count: nextSkipNo,
        });
        res.end();
      } else {
        console.log(["cache'te yok", req.body.skip]);
        return next();
      }

    } catch (err) {
      console.error(['verifyCache', err]);
      res.send({
        status: false,
        hasNext: false,
        video: {},
        count: showOnlyInStageScreen[0],
      });
      res.end();
    }
  };

  const hasNext = async (req, res, next) => {
    res.setHeader("Content-Type", "application/json");
    try {
      console.log(['hasNext', passive_cache_list, req.body.skip])
      if (!req.body.list) {
        while (passive_cache_list.includes(req.body.skip)) {
          req.body.skip = req.body.skip + 1;
        }
      }
      if (!req.body.list && db_counter > LOOP_LAST_THRESHOLD && db_counter - LOOP_LAST_THRESHOLD > req.body.skip) {
        req.body.skip = db_counter - LOOP_LAST_THRESHOLD;
      }
      const client_image_count = req.body.skip;
      console.log(['client', client_image_count, 'db', db_counter])

      if (db_counter > client_image_count) {
        console.log(['next image avaible']);
        return next();
      } else {
        if (req.body.list) {
          res.send({
            status: false,
            hasNext: false,
            video: {},
            count: client_image_count + 1
          });
        } else {
          if (db_counter > LOOP_LAST_THRESHOLD && db_counter - LOOP_LAST_THRESHOLD > req.body.skip) {
            req.body.skip = db_counter - LOOP_LAST_THRESHOLD;
          } else {
            let startWith = 0;
            if (db_counter > LOOP_LAST_THRESHOLD) {
              startWith = db_counter - LOOP_LAST_THRESHOLD;
              if (startWith < 0) {
                startWith = 0;
              }
            }
            req.body.skip = startWith;
          }

          return next();
        }

        // res.send({
        //   status: true,
        //   hasNext: false,
        //   video: {}
        // });
        // res.end();
      }
    } catch (err) {
      console.error(['hasNext', err])
      let startWith = 0;
      if (!req.body.list && db_counter > LOOP_LAST_THRESHOLD) {
        startWith = db_counter - LOOP_LAST_THRESHOLD;
      }
      res.send({
        status: false,
        hasNext: false,
        video: {},
        count: startWith
      });
      // res.end();
    }
    return res.end();
  }

  const hasNextSelected = async (req, res, next) => {
    res.setHeader("Content-Type", "application/json");
    try {
      console.log(['hasNextSelected', req.body.skip]);
      const client_image_count = req.body.skip;
      console.log(['client', client_image_count, 'db', db_counter])
      let selectedSkipNo = showOnlyInStageScreen.indexOf(client_image_count);
      if (showOnlyInStageScreen.length >= selectedSkipNo) {
        console.log(['next image avaible']);
        return next();
      } else {
        req.body.skip = showOnlyInStageScreen[0];
        return next();
      }
    } catch (err) {
      console.error(['hasNextSelected', err])
      let startWith = 0;
      if (db_counter > LOOP_LAST_THRESHOLD) {
        startWith = db_counter - LOOP_LAST_THRESHOLD;
      }
      res.send({
        status: false,
        hasNext: false,
        video: {},
        count: startWith
      });
      // res.end();
    }
    return res.end();
  }

  app.post("/api/image/getImage", hasNext, verifyCache, async (req, res) => {
    try {
      console.log(['getImage'])
      const client_image_count = req.body.skip;
      let status = true;
      console.log(['skip', client_image_count])
      const img = await Image.findOne({ active: true }).skip(client_image_count).catch((err) => {
        console.log(err);
        status = false;
      });
      if (!img) {
        console.log(['RESİM YOK', skip])
        status = false;
      }

      res.send({
        status: status,
        hasNext: true,
        img: img,
      });
      // res.end();
    } catch (error) {
      console.error(['error', error]);
      res.send({
        status: false,
        hasNext: false,
        img: {},
      });
      // res.end(); 
    }
    return res.end();
  });

  app.post("/api/video/getVideo", hasNext, verifyCache, async (req, res) => {
    try {
      console.log(['getVideo'])
      const client_image_count = req.body.skip;
      let status = true;
      console.log(['skip', client_image_count])
      const vid = await Video.findOne({}).skip(client_image_count).catch((err) => {
        console.log(err);
        status = false;
      });

      if (!vid) {
        console.log(['VİDEO YOK', skip])
        status = false;
      }
      if (`${vid.data}`.includes('quicktime')) {
        vid.data = `${vid.data}`.replace('quicktime', 'mp4');
      }

      res.send({
        status: status,
        hasNext: true,
        video: vid,
        count: client_image_count + 1,
      });
      // res.end();
    } catch (error) {
      console.error(['error', error]);
      let startWith = 0;
      if (!req.body.list && db_counter > LOOP_LAST_THRESHOLD) {
        startWith = db_counter - LOOP_LAST_THRESHOLD;
      }
      res.send({
        status: false,
        hasNext: false,
        video: {},
        count: startWith
      });
      // res.end(); 
    }
    return res.end();
  });


  app.post("/api/video/getVideoSelected", hasNextSelected, verifyCacheSelected, async (req, res) => {
    try {
      console.log(['getVideo'])
      const client_image_count = req.body.skip;
      let status = true;
      console.log(['skip', client_image_count])
      const vid = await Video.findOne({}).skip(client_image_count).catch((err) => {
        console.log(err);
        status = false;
      });
      if (!vid) {
        console.log(['VİDEO YOK', skip])
        status = false;
      }

      res.send({
        status: status,
        hasNext: true,
        video: vid,
        count: client_image_count + 1,
      });
      // res.end();
    } catch (error) {
      console.error(['error', error]);
      let startWith = 0;
      if (db_counter > LOOP_LAST_THRESHOLD) {
        startWith = db_counter - LOOP_LAST_THRESHOLD;
      }
      res.send({
        status: false,
        hasNext: false,
        video: {},
        count: startWith
      });
      // res.end(); 
    }
    return res.end();
  });

  app.post("/api/video/setPassive", async (req, res) => {
    try {
      console.log(['setPassive'])
      const idList = req.body.idList;
      const skipNo = req.body.skipList;
      let status = true;
      console.log(['idList', idList])
      for (let i = 0; i < idList.length; i++) {
        const _id = Types.ObjectId(idList[i]);
        const vid = await Video.updateOne({ _id: _id }, { $set: { active: false } }).catch((err) => {
          console.log(err);
          status = false;
        });
      }
      skipNo.forEach((e) => {
        passive_cache_list.push(e);
      })
      res.send({
        status: status,
      });
      // res.end();
    } catch (error) {
      console.error(['error', error]);
      res.send({
        status: false,
      });
      // res.end(); 
    }
    return res.end();
  });

  app.post("/api/video/setShowOnlyInStageScreen", async (req, res) => {
    try {
      console.log(['setShowOnlyInStageScreen'])
      const skipNoList = req.body.skipNoList;
      let status = true;
      console.log(['setShowOnlyInStageScreen', skipNoList]);
      showOnlyInStageScreen = skipNoList;
      res.send({
        status: status,
      });
      // res.end();
    } catch (error) {
      console.error(['error', error]);
      res.send({
        status: false,
      });
      // res.end(); 
    }
    return res.end();
  });

  app.post("/api/video/upload", async (req, res) => {
    try {
      let status = true;
      let vid = req.body.video;
      if (`${vid}`.includes('quicktime')) {
        vid = `${vid}`.replace('quicktime', 'mp4');
      }
      // console.log(['vid', vid]);
      const no = await Video.countDocuments().catch((er) => {
        console.error(er);
      });
      console.log(['no', no])

      const video = new Video({
        data: vid,
        no: no,
        active: true
      })

      // console.log(['video model', video])

      let insertedVideo = await video.save().catch((err) => {
        console.log(err);
        status = false;
      })

      // console.log(['insertedVideo', insertedVideo])

      console.log(['status 1', status])
      res.send({
        status: status,
      });

      const newCount = await Video.countDocuments().catch((er) => {
        console.error(er);
      });
      console.log(['count after new upload', db_counter, newCount])
      db_counter = newCount;
      let strData = JSON.stringify(insertedVideo);
      if (`${strData}`.includes('quicktime')) {
        strData = `${strData}`.replace('quicktime', 'mp4');
      }
      // console.log(['strData', strData])
      cache.set(`${no}`, strData);
      trigger = false;
    } catch (error) {
      console.error(['upload', error])
      res.send({
        status: false,
      });
    }
    res.end();
    return;
  });

  // app.get("/api/image/setCache", async (req, res) => {
  setCache();
  //   res.end();
  //   return;
  // });

  app.get('/', async (_req, res) => {
    // await setCache();
    return res.status(200).json({
      resultMessage: {
        en: 'Project is successfully working...',
        tr: 'Proje başarılı bir şekilde çalışıyor...'
      },
      resultCode: '00004'
    }).end();
  });

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Content-Security-Policy-Report-Only', 'default-src: https:');
    if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', 'PUT POST PATCH DELETE GET');
      return res.status(200).json({});
    }
    next();
  });

}

