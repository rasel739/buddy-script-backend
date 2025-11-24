import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';
import config from '../../config';
import { jwtHelpers } from '../../helpers/jwtHelpers';
import ApiError from '../../errors/ApiError';

const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //get authorization token
    const authHeader = req.headers.authorization;

    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;

    if (!token) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized');
    }
    // verify token
    let verifiedUser = null;

    verifiedUser = jwtHelpers.verifyToken(token, config.jwt.secret as Secret);

    req.user = verifiedUser;

    next();
  } catch (error) {
    next(error);
  }
};

export default auth;
