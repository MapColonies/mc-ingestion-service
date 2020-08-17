import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ValidationModule } from '@map-colonies/nest-schema-validator';
import { UploadModule } from './Modules/upload/upload.module';
import { LoggerModule } from './Modules/logger/logger.module';
import { ErrorHandler } from './Middleware/ErrorHandler';
import { ConfigurationModule } from './Modules/configuration/configuration.module';
import { ProbeModule } from './Modules/probe/probe.module';
import { RequestLoggerMiddleware } from './Middleware/RequestLoggerMiddleware';

@Module({
  imports: [
    UploadModule,
    LoggerModule,
    ConfigurationModule,
    ValidationModule,
    ProbeModule,
  ],
  controllers: [],
  providers: [ErrorHandler],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
