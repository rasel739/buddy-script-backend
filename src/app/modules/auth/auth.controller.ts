import httpStatus from 'http-status';
import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { AuthService } from './auth.service';
import sendResponse from '../../../shared/sendResponse';
import { IUserResponse } from './auth.interface';

const userRegister = catchAsync(async (req: Request, res: Response) => {
  const { ...userRegisterData } = req.body;

  const result = await AuthService.userRegister(userRegisterData);

  sendResponse<IUserResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User registered successfully',
    data: result,
  });
});

const userLogin = catchAsync(async (req: Request, res: Response) => {
  const { ...loginData } = req.body;

  const result = await AuthService.userLogin(loginData);

  sendResponse<IUserResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User logged in successfully',
    data: result,
  });
});

const getUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.user as { id: string };

  const result = await AuthService.getUser(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User get successfully',
    data: result,
  });
});

export const AuthController = {
  userRegister,
  userLogin,
  getUser,
};
