import { Request, Response, NextFunction } from 'express';
import verifyToken from '../../src/middlewares/verifyToken.middleware';

// TODO: finish testing for middlewares (what is mock functions in jest?)
describe.skip('Middleware tester', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: Partial<NextFunction>;

  test('Failure verifying Token', () => {
    req = {
      headers: {
        'x-access-token': 'asdasd'
      }
    };
    verifyToken(req as Request, res as Response, next as NextFunction);
    expect(req.headers).toBeCalledWith(verifyToken);
  });
});
