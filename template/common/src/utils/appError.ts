export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // 예측 가능한 에러임을 표시

    Error.captureStackTrace(this, this.constructor);
  }
}