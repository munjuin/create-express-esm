import * as userService from '../services/userService.js';

export const getUsers = async (req, res, next) => {
  try {
    const users = await userService.findAllUsers();
    res.status(200).json(users);
  } catch (error) {
    next(error); // 에러 미들웨어로 전달
  }
};