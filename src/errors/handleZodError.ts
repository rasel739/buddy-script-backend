import { ZodError } from 'zod';
import { IGenericErrorMessage } from '../interface/error';
import { IGenericErrorResponse } from '../interface/common';

const handleZodError = (error: ZodError): IGenericErrorResponse => {
  const errors: IGenericErrorMessage[] = error.issues.map((issue) => {
    const rawPath = issue?.path[issue.path.length - 1];
    const path: string | number =
      typeof rawPath === 'symbol' ? rawPath.toString() : (rawPath as string | number);
    return {
      path,
      message: issue?.message,
    };
  });

  const statusCode = 400;

  return {
    statusCode,
    message: 'Validation Error',
    errorMessages: errors,
  };
};

export default handleZodError;
