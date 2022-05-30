import express, { Request, Response } from 'express';
import rootRouter from '../routes/index';

const server = express();

server.get('/', (req: Request, res: Response) => {
  return res.redirect('/api');
});

server.use('/api', rootRouter);

// TODO: include /docs for documentation with swagger

export default server;
