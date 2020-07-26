import { Module, HttpModule } from '@nestjs/common';
import { UploadController } from './Controllers/upload.controller';
import { UploadService } from './Services/Upload.service';
import { StorageModule } from '../storage/storage.module';
import { MulterModule } from '@nestjs/platform-express';
import { StorageEngineFactory } from '../storage/StorageEngineFactory';
import { FilteredFileFieldsInterceptor } from './Interceptors/FilteredFileFieldsInterceptor';
import { ServiceClientsModule } from '../service-clients/service-clients.module';
import { CreateFileFilter } from './Filters/CreateFileFilter';
import { UpdateFileFilter } from './Filters/UpdateFileFilter';
import { LoggerModule } from '../logger/logger.module';
import { Logger } from '../logger/Logger';
import { ConfigService } from '../configuration/ConfigService';
import { ConfigurationModule } from '../configuration/configuration.module';

const multerOptionsFactory = {
  imports: [StorageModule, LoggerModule],
  useFactory: (
    storageFactory: StorageEngineFactory,
    config: ConfigService,
    logger: Logger
  ) => {
    return {
      storage: storageFactory.getStorage(config, logger),
    };
  },
  inject: [StorageEngineFactory, ConfigService, Logger],
};

@Module({
  imports: [
    MulterModule.registerAsync(multerOptionsFactory),
    ServiceClientsModule,
    StorageModule,
    ConfigurationModule,
    HttpModule,
  ],
  controllers: [UploadController],
  providers: [
    UploadService,
    FilteredFileFieldsInterceptor,
    CreateFileFilter,
    UpdateFileFilter,
  ],
})
export class UploadModule {}
