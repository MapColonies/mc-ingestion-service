/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { MCLogger } from '@map-colonies/mc-logger';

export class NestLogger {
  constructor(private logger: MCLogger) {}

  log(message: any, context?: string): any {
    this.logger.info(`[${context}] ${message}`);
  }

  error(message: any, trace?: string, context?: string): any {
    this.logger.error(`[${context}] ${message}`);
  }

  warn(message: any, context?: string): any {
    this.logger.error(`[${context}] ${message}`);
  }

  debug?(message: any, context?: string): any {
    this.logger.warning(`[${context}] ${message}`);
  }

  verbose?(message: any, context?: string): any {
    this.logger.verbose(`[${context}] ${message}`);
  }
}
