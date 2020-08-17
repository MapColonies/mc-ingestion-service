import { MCLogger } from '@map-colonies/mc-logger';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  constructor(private logger: MCLogger) {}

  use(req: Request, res: Response, next: () => void): void {
    this.logger.debug(
      'received %s request on %s \nbody: %s',
      req.method,
      req.originalUrl,
      req.body ? JSON.stringify(req.body) : null
    );
    next();
  }
}
