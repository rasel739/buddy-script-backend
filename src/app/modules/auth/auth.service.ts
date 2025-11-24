import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';
import { ILogin, IUser, IUserResponse } from './auth.interface';
import bcrypt from 'bcrypt';
import config from '../../../config';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import { email } from 'zod';

const userRegister = async (payload: IUser): Promise<IUserResponse> => {
  const existingUser = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (existingUser) {
    throw new ApiError(httpStatus.CONFLICT, 'User already exists');
  }

  const hashedPassword = await bcrypt.hash(payload.password, Number(config.bycrypt_salt_rounds));

  const newUser = await prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      password: hashedPassword,
    },
  });

  const accessToken = jwtHelpers.createToken(
    { id: newUser.id, email: newUser.email },
    config.jwt.secret as string,
    config.jwt.expires_in as string
  );

  return {
    accessToken,
  };
};

const userLogin = async (payload: ILogin): Promise<IUserResponse> => {
  const existingUser = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (!existingUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Invalid credentials');
  }

  const isPasswordMatched = await bcrypt.compare(payload.password, existingUser.password);

  if (!isPasswordMatched) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect');
  }

  const accessToken = jwtHelpers.createToken(
    { id: existingUser.id, email: existingUser.email },
    config.jwt.secret as string,
    config.jwt.expires_in as string
  );

  return {
    accessToken,
  };
};

const getUser = async (
  userId: string
): Promise<{ user: { id: string; name: string; email: string } }> => {
  const userCheck = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!userCheck) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const user = {
    id: userCheck.id,
    name: userCheck.name,
    email: userCheck.email,
  };

  return {
    user,
  };
};

export const AuthService = {
  userRegister,
  userLogin,
  getUser,
};
