import { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const NODE_ENV = process.env.NODE_ENV;

const verifyAdmin = (req: Request, res: Response, next: NextFunction) => {
  // By now, all petitions only for admins will be rejected except if testing is executing
  // TODO: implemet the middleware
  if (NODE_ENV === 'test') {
    next();
  } else {
    return res.status(403).send({
      status: 403,
      message: 'You don\'t have permission to use this endpoint'
    });
  }
};

export default verifyAdmin;
