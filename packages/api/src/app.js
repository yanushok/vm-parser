import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

import router from './routes';

const API_PATH = '/api';
const app = express();
const isDev = process.env.NODE_ENV === 'development';

if (isDev) {
    app.use(morgan('dev'));
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(API_PATH, router);

export default app;
