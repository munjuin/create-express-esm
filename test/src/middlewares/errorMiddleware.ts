import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError.js';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  err.statusCode = err.statusCode || 500;

  // Prisma 고유 에러 처리 (예: 이메일 중복)
  if (err.code === 'P2002') {
    err.message = '이미 사용 중인 데이터(이메일 등)가 있습니다.';
    err.statusCode = 400;
  }

  res.status(err.statusCode).json({
    status: 'error',
    message: err.message,
    // 개발 환경에서만 에러 스택 표시
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};