/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Logger } from './Logger';

export class NestLogger {
  constructor(private logger: Logger) {}

  log(message: any, context?: string): any {
    this.logger.log('info', `[${context}] ${message}`);
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
    this.logger.log('verbose', `[${context}] ${message}`);
  }
}
