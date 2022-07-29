import { NextFunction, Request, Response } from 'express';
import { LogError } from '../utils/Logger';
import { userEntity } from '../models/schemas/user';

/**
 * Middleware to verify if exists repeated data in user's registration
 * @param {Request} req Express request
 * @param {Response} res Express response
 * @param {NextFunction} next Express next function
 * @returns Next execution or error message
 */
const verifyRepeatedData = async (req: Request, res: Response, next: NextFunction) => {
  const username: any = req.body?.username;
  const email: any = req.body?.email;

  try {
    const userModel = userEntity();
    const usernameFound = await userModel.find({ username }).countDocuments();
    if (usernameFound) {
      return res.status(400).send({
        status: 400,
        message: 'Username already in use'
      });
    }
    const emailFound = await userModel.find({ email }).countDocuments();
    if (emailFound) {
      return res.status(400).send({
        status: 400,
        message: 'Email already in use'
      });
    };
  } catch (error) {
    LogError(error);
  }

  next();
};

export default verifyRepeatedData;
