import { ErrorRequestHandler, Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';
import config from '../../config';
import ApiError from '../../errors/ApiError';
import handleClientError from '../../errors/handleClientError';
import handleZodError from '../../errors/handleZodError';
import { IGenericErrorMessage } from '../../interface/error';

const globalErrorHandler: ErrorRequestHandler = (
  error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (config.env === 'development') {
    console.error('🔥 Global Error Handler:', error);
  }

  let statusCode = 500;
  let message = 'Something went wrong!';
  let errorMessages: IGenericErrorMessage[] = [];

  if (error instanceof Prisma.PrismaClientValidationError) {
    message = 'Database validation error';
    errorMessages = [
      {
        path: '',
        message: error.message,
      },
    ];
    statusCode = 400;
  } else if (error instanceof ZodError) {
    const simplifiedError = handleZodError(error);
    ({ statusCode, message, errorMessages } = simplifiedError);
  } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const simplifiedError = handleClientError(error);
    ({ statusCode, message, errorMessages } = simplifiedError);
  } else if (error instanceof ApiError) {
    statusCode = error.statusCode || 500;
    message = error.message || 'Internal Server Error';
    errorMessages = [
      {
        path: '',
        message: error.message,
      },
    ];
  } else if (error instanceof Error) {
    message = error.message || 'Unexpected Error';
    errorMessages = [
      {
        path: '',
        message: error.message,
      },
    ];
  } else {
    message = 'Unknown error occurred';
    errorMessages = [
      {
        path: '',
        message: JSON.stringify(error),
      },
    ];
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorMessages,
    stack: config.env !== 'production' ? error?.stack : undefined,
  });
};

export default globalErrorHandler;
