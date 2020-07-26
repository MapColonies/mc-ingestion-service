import {
  Logger as winstonLogger,
  createLogger,
  format,
  transports,
} from 'winston';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '../configuration/ConfigService';

@Injectable()
export class Logger {
  private logger: winstonLogger;

  constructor(private config: ConfigService) {
    const { combine, timestamp, splat, json } = format;
    this.logger = createLogger({
      level: config.get('logger.level', 'error'),
      format: combine(splat(), timestamp(), json()),
      transports: [
        new transports.Console(),
        new transports.File({
          filename: config.get('logger.logPath'),
        }),
      ],
    });
  }

  log(level: string, message: string, ...meta: any[]): void {
    this.logger.log(level, message, ...meta);
  }

  debug(message: string, ...meta: any[]): void {
    this.log('debug', message, ...meta);
  }

  info(message: string, ...meta: any[]): void {
    this.log('info', message, ...meta);
  }

  warning(message: string, ...meta: any[]): void {
    this.log('warn', message, ...meta);
  }

  error(message: string, ...meta: any[]): void {
    this.log('error', message, ...meta);
  }
}
