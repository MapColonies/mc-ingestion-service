import { Module } from '@nestjs/common';
import { ValidationModule } from 'mc-nest-schema-validator';
import { UploadModule } from './Modules/upload/upload.module';
import { LoggerModule } from './Modules/logger/logger.module';
import { ErrorHandler } from './Middleware/ErrorHandler';
import { ConfigurationModule } from './Modules/configuration/configuration.module';
@Module({
  imports: [UploadModule, LoggerModule, ConfigurationModule, ValidationModule],
  controllers: [],
  providers: [ErrorHandler],
})
export class AppModule {}
