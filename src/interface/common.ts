import { IGenericErrorMessage } from './error';

// global error type
export type IGenericErrorResponse = {
  statusCode: number;
  message: string;
  errorMessages: IGenericErrorMessage[];
};
