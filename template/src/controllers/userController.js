import * as userService from '../services/userService.js';

export const getUsers = async (req, res) => {
  try {
    const users = await userService.findAllUsers(); // 서비스 호출
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};