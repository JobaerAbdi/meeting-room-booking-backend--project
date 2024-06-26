import { Response } from 'express';
import httpStatus from 'http-status'

type TResponse<T> = {
  statusCode: number;
  success: boolean;
  message?: string;
  data: T;
};

const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  res.status(data?.statusCode).json({
    success: data.success,
    statusCode: httpStatus.OK,
    message: data.message,
    data: data.data,
  });
};

export default sendResponse;