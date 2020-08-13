import {
  ExceptionFilter,
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Response } from 'express';
import { MCLogger } from '@map-colonies/mc-logger';
import { ApiHttpResponse, ApiHttpError } from '@map-colonies/mc-model-types';

type ErrorResponse = {
  statusCode: number;
  message: string | unknown;
};

@Catch()
@Injectable()
export class ErrorHandler implements ExceptionFilter {
  constructor(private logger: MCLogger) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    const apiError: ApiHttpError = {
      message: '',
      statusCode: 500,
    };
    let logContent: string;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const error = exception.getResponse().valueOf() as ErrorResponse;
      let logMessage: string;
      if (typeof error.message != 'string') {
        logMessage = JSON.stringify(error.message);
        apiError.message = error.message as { [key: string]: unknown };
      } else {
        logMessage = error.message;
        apiError.message = error.message;
      }
      logContent = `type: ${exception.name}. message: ${logMessage} \ntrace:${exception.stack}`;
    } else if (exception instanceof Error) {
      apiError.message = exception.message;
      logContent = `type: ${exception.name}. message: ${exception.message} \ntrace:${exception.stack}`;
    } else {
      apiError.message = 'internal server error';
      logContent = `error: ${'' + exception}`;
    }

    const logLevel =
      status == HttpStatus.INTERNAL_SERVER_ERROR ? 'error' : 'info';
    apiError.statusCode = status;
    this.logger.log(logLevel, logContent);

    const content: ApiHttpResponse = {
      success: false,
      data: null,
      error: apiError,
    };
    response.status(status).json(content);
  }
}
