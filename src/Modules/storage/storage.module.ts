import { Module } from '@nestjs/common';
import { StorageEngineFactory } from './StorageEngineFactory';
import { LoggerModule } from '../logger/logger.module';
@Module({
  imports: [LoggerModule],
  providers: [StorageEngineFactory],
  exports: [StorageEngineFactory],
})
export class StorageModule {}
