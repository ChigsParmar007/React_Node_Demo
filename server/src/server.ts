import 'reflect-metadata';
import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { InversifyExpressServer } from 'inversify-express-utils';
import cors from 'cors';
import morgan from 'morgan';
import * as path from 'path';
import { iocContainer } from './inversify.config';
import './controller/index';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const DB: any = process.env.MONGODB_URI?.replace('<password>', process.env.MONGODB_PASSWORD || '');

mongoose.set('strictQuery', true);
mongoose
  .connect(DB)
  .then(() => {
    console.log('MongoDB Cluster Connected');
  })
  .catch((error) => console.log(error));

const server = new InversifyExpressServer(iocContainer, null, {
  rootPath: '/api',
});

server.setConfig((app) => {
  app.use(express.json());
  app.use(cors());
  app.use(morgan('dev'));
});

const app = server.build();

const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
