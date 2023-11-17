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
  let currentSkip = 0;
  // app.use(prefix, routes);
  const cache_384x960 = new NodeCache({ stdTTL: 15, deleteOnExpire: false });
  const cache_1344x416 = new NodeCache({ stdTTL: 15, deleteOnExpire: false });
  const cache_2160x3840 = new NodeCache({ stdTTL: 15, deleteOnExpire: false });
  const cache_1080x1920 = new NodeCache({ stdTTL: 15, deleteOnExpire: false });
  const cache_960x2016 = new NodeCache({ stdTTL: 15, deleteOnExpire: false });

  var client_id_last_skip = new Map();

  const getCache = (type) => {
    let cache = cache_384x960;
    switch (type) {
      case "384x960":
        cache = cache_384x960;
        break;
      case "1344x416":
        cache = cache_1344x416;
        break;
      case "2160x3840":
        cache = cache_2160x3840;
        break;
      case "1080x1920":
        cache = cache_1080x1920;
        break;
      case "cache_960x2016":
        cache = cache_960x2016;
        break;
      default:
        cache = cache_1080x1920;
        break;
    }
    return cache;
  }


  const setCache = async (req, res, next) => {
    try {
      const list = await Image.find({});
      const reversedList = list.reverse();
      const length = reversedList.length;
      const promiseList = [];
      console.time('setCache')
      for (let i = 0; i < length; i++) {
        const img = reversedList[i];
        let cache = getCache(img.type);
        cache.set(length - 1 - i, img);
      }
      console.timeEnd('setCache')
      // return res.status(200).json({
      //   status: true,
      // })
    } catch (error) {
      console.log(error);
      // return res.status(200).json({
      //   status: false,
      // })
    }
    return true;
  }

  const verifyCache = async (req, res, next) => {
    try {
      let type = req.body.type;
      let id = req.body.id;

      console.log(['type', type])
      const countOf = await Image.countDocuments({ type: type });
      console.log(['countOf', countOf])
      // if (currentSkip === 0) {
      //   req.body.skip = countOf;
      // } else if (currentSkip === countOf) {
      //   req.body.skip = currentSkip - 1;
      // }

      // if (req.body.skip > countOf) {
      //   // req.body.skip = req.body.skip % countOf;
      //   req.body.skip = 0;
      // }
      // currentSkip = req.body.skip;

      console.log(['client id', id]);
      console.time('client_skip')
      let client_skip = client_id_last_skip.get(id);
      if (!client_skip) {
        client_id_last_skip.set(id, countOf - 1);
        req.body.skip = countOf - 1;
      } else {
        if (client_skip == 0) {
          client_skip = countOf - 1;
        } else {
          client_skip = client_skip - 1;
        }
        client_id_last_skip.set(id, client_skip);
        req.body.skip = client_skip;
      }
      let cache = getCache(type);
      if (!cache) {
        console.log(['cache error']);
      }
      console.timeEnd('client_skip')
      console.log(['req.body.skip', req.body.skip])
      if (cache.has(req.body.skip)) {
        return res.status(200).json({
          status: true,
          img: cache.get(req.body.skip),
        })
      }
      console.log(['cache te yok']);
      return next();
    } catch (err) {
      throw new Error(err);
    }
  };

  app.post("/api/image/getImage", verifyCache, async (req, res) => {
    let status = true;
    let list = [];

    let skip = Number(req.body.skip);
    if (skip < 0) {
      skip = 0;
    }
    list = await Image.findOne({ type: req.body.type }).skip(skip).catch((err) => {
      console.log(err);
      status = false;
    });
    if (!list) {
      console.log(['RESİM YOK', skip])
    }

    res.send({
      status: status,
      img: list
    });
    res.end();
    let cache = getCache(req.body.type)
    cache.set(skip, list);
    return;
  });

  app.post("/api/image/upload", async (req, res) => {
    let status = true;
    let img = req.body.img;
    let type = req.body.type;
    const countOf = await Image.countDocuments().catch((er) => {
      console.error(er);
      status = false;
    });
    const image = new Image({
      data: img,
      type: type
    })

    await image.save().catch((err) => {
      console.log(err);
      status = false;
    })
    currentSkip = 0;

    res.send({
      status: status,
    });
    res.end();
    let cache = getCache(type)
    cache.set(countOf + 1, image);
    return;
  });

  app.get("/api/image/setCache", setCache, async (req, res) => {
    res.end();
    return;
  });

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

