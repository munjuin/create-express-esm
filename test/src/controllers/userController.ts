import { Request, Response, NextFunction } from 'express';
import { userService } from '../services/userService.js';

export const userController = {
  // 1. 모든 사용자 조회
  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await userService.getAllUsers();
      res.json(users);
    } catch (error) {
      next(error); // 에러를 전역 핸들러로 던짐
    }
  },

  // 2. 새 사용자 생성
  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, name } = req.body;
      const newUser = await userService.createUser({ email, name });
      res.status(201).json(newUser);
    } catch (error) {
      next(error); // 여기서 에러가 던져지면 errorHandler가 P2002(중복) 등을 처리함
    }
  },

  // 3. 특정 사용자 조회
  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const user = await userService.getUserById(id);
      
      if (!user) {
        // AppError를 사용해 404 에러를 직접 던질 수도 있습니다.
        throw new Error('사용자를 찾을 수 없습니다.');
      }
      
      res.json(user);
    } catch (error) {
      next(error);
    }
  }
};