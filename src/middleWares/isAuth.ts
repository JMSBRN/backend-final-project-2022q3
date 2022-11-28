import { NextFunction, Request, RequestHandler, Response } from "express";
import { createError } from "../services/error.service";
import { checkToken } from "../services/token.service";

const isAuth: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  if (['/auth/signin', '/auth/signup'].includes(req.path) || req.path.substring(0, 7) == '/files/') {
    return next();
  }
  const authHeader = req.header('Authorization');
  if (authHeader) {
    const [type, token] = authHeader.split(' ');
    if (type === 'Bearer' && checkToken(token)) {
      return next();
    }
  }
  return res.status(403).send(createError(403, 'Invalid token'));
}

export default isAuth;