import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/userService.js';

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await userService.findAllUsers();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};