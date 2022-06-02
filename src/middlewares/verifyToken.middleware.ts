import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { LogError } from '../utils/Logger';

dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;

/**
 * Middleware to verify token validity before access to any endpoint
 * @param {Request} req Express request
 * @param {Response} res Express response
 * @param {NextFunction} next Express next function
 * @returns Next execution or error message
 */
const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token: any = req.headers['x-access-token'];

  // Verify existence
  if (!token) {
    LogError('[MIDDLEWARE] Token not found in headers');
    return res.status(401).send({
      status: 401,
      message: 'Token not found in headers'
    });
  }

  // Verificar el jwt obtenido
  jwt.verify(token, SECRET_KEY!, (err: any, decoded: any) => {
    if (err) {
      LogError('[MIDDLEWARE] Invalid Token');
      return res.status(401).send({
        status: 401,
        message: 'Invalid token'
      });
    }
    // Save user ID
    res.locals.userId = decoded.id;
    // Execute Next Function -> Protected routes will be executed
    next();
  });
};

export default verifyToken;
