import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

import userRoutes from './routes/userRoutes.js';

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// 라우터 연결 (Layered Arch 시작점)
app.use('/api/users', userRoutes);

app.get('/', (req, res) => res.send('Welcome to Modern Express!'));

export default app;