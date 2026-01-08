import { Request, Response } from 'express';
import * as userService from '../services/userService.js';

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await userService.fetchAllUsers();
    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};