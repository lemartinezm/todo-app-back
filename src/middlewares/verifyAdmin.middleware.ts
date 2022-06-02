import { NextFunction, Request, Response } from 'express';

const verifyAdmin = (req: Request, res: Response, next: NextFunction) => {
  // By now, all petitions only for admins will be rejected
  // TODO: implemet the middleware
  return res.status(403).send({
    status: 403,
    message: 'You don\'t have permission to use this endpoint'
  });
};

export default verifyAdmin;
