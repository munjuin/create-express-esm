import userRoutes from './routes/userRoutes.js';
import { errorHandler } from './middlewares/errorMiddleware.js';
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/users', userRoutes);
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/users', userRoutes);

// Health Check
app.get('/', (req: Request, res: Response) => {
  res.send('Create Express ESM (TypeScript) Server is Running!');
});


// 전역 에러 핸들러
app.use(errorHandler);

export default app;