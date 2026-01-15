import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json()); // cli.js가 이 줄 바로 아래에 라우터를 꽂습니다.

app.get('/', (req, res) => res.send('Welcome to Modern Express!'));

export default app; // cli.js가 이 줄 바로 위에 에러 핸들러를 꽂습니다.