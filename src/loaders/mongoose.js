import mongoose from 'mongoose';

import { dbUri } from '../config/index.js';

export default async () => {
  mongoose.set("strictQuery", false);
  await mongoose.connect(dbUri, {
    dbName: 'database',
    useNewUrlParser: true,
    useUnifiedTopology: true,
    keepAlive: true,
    socketTimeoutMS: 360000,
    connectTimeoutMS: 360000,
    autoIndex: true,

  })
    .then(() => {
      console.log('Mongodb Connection');
    })
    .catch(err => {
      console.log(err);
    });
};