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
import { Image } from "../models/index.js";

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
  app.use(cors());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(morgan('dev'));
  app.use(helmet());
  app.use(compression());
  app.use(express.static('public'));
  app.disable('x-powered-by');
  app.disable('etag');

  app.use(rateLimiter);

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

  var db_counter = 0;

  const setCache = async () => {
    try {
      console.time('setCache')
      const list = await Image.find({});
      console.log(['db Image count', list.length])
      db_counter = list.length;
      for (let i = 0; i < list.length; i++) {
        const img = list[i];
        cache.set(i, img?.data);
      }
      console.timeEnd('setCache')
    } catch (error) {
      console.error(['setCache', error]);
    }
    return true;
  }

  const verifyCache = async (req, res, next) => {
    try {
      console.log(['verifyCache'])
      const client_image_count = req.body.count;
      const hasCache = cache.has(`${client_image_count}`);
      if (hasCache) {
        const img = cache.get(`${client_image_count}`);
        // console.log(['verifyCache', img])
        const image = new Image({
          data: img,
        })
        res.send({
          status: true,
          hasNext: true,
          img: image,
        });
        res.end();
      } else {
        console.log(["cache'te yok"]);
        return next();
      }

    } catch (err) {
      console.error(['verifyCache', err]);
      res.send({
        status: false,
        hasNext: false,
        img: {}
      });
      res.end();
    }
  };

  const hasNext = async (req, res, next) => {
    res.setHeader("Content-Type", "application/json");
    try {
      console.log(['hasNext'])
      const client_image_count = req.body.count;
      console.log(['client', client_image_count, 'db', db_counter])
      if (db_counter > client_image_count) {
        console.log(['next image avaible']);
        return next();
      } else {
        res.send({
          status: true,
          hasNext: false,
          img: {}
        });
        // res.end();
      }
    } catch (err) {
      console.error(['hasNext', err])
      res.send({
        status: false,
        hasNext: false,
        img: {}
      });
      // res.end();
    }
    return res.end();
  }

  app.post("/api/image/getImage", hasNext, verifyCache, async (req, res) => {
    try {
      console.log(['getImage'])
      const client_image_count = req.body.count;
      let status = true;
      console.log(['skip', client_image_count])
      const img = await Image.findOne({}).skip(client_image_count).catch((err) => {
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

  app.post("/api/image/upload", async (req, res) => {
    try {
      let status = true;
      let img = req.body.img;

      const image = new Image({
        data: img,
      })

      await image.save().catch((err) => {
        console.log(err);
        status = false;
      })

      res.send({
        status: status,
      });
      res.end();


      const newCount = await Image.countDocuments().catch((er) => {
        console.error(er);
      });
      console.log(['count after new upload', db_counter, newCount])
      db_counter = newCount;
      cache.set(`${db_counter}`, img);
      trigger = false;
    } catch (error) {
      console.error(['upload', error])
    }
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

  // app.use((_req, _res, next) => {
  //   const error = new Error('Endpoint could not find!');
  //   error.status = 404;
  //   next(error);
  // });

  // app.use((error, req, res, _next) => {
  //   res.status(error.status || 500);
  //   let resultCode = '00015';
  //   let level = 'External Error';
  //   if (error.status === 500) {
  //     resultCode = '00013';
  //     level = 'Server Error';
  //   } else if (error.status === 404) {
  //     resultCode = '00014';
  //     level = 'Client Error';
  //   }
  //   return res.json({
  //     resultMessage: {
  //       en: error.message,
  //       tr: error.message
  //     },
  //     resultCode: resultCode,
  //   });

  // });
}

