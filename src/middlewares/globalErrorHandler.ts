import { NextFunction, Request, Response } from "express";
import { TErrorSources } from "../interface/error";
import { ZodError } from "zod";
import handleValidationError from "../errors/handleValidationError";
import handleZodError from "../errors/handleZodError";
import config from "../config";
import handleCastError from "../errors/handleCastError";
import handleDuplicateError from "../errors/handleDuplicateError";

const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  let statusCode =  500;
  let message = 'Something went wrong!';

  let errorSources: TErrorSources = [
    {
    path: '',
    message: 'Something went wrong!'
    }
  ]

  if(err instanceof ZodError){
    const simplifiedError = handleZodError(err)
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources
    // console.log(simplifiedError);
  }
  else if(err?.name === "ValidationError"){  
    const simplifiedError = handleValidationError(err)
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources
  }
  else if(err?.name === "CastError"){   
    const simplifiedError = handleCastError(err)
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources
  }
  else if(err?.code === 11000){   
    const simplifiedError = handleDuplicateError(err)
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources
  }
  
    return res.status(statusCode).json({
      success: false,
      message,
      errorSources,
      stack: config.node_env === "development" ? err?.stack : null   
    })
}

export default globalErrorHandler