import { Module, Global } from '@nestjs/common';
import { ConfigService } from './ConfigService';

@Global()
@Module({
  providers: [
    ConfigService,
    {
      provide: 'ConfigurationService',
      useExisting: ConfigService,
    },
  ],
  exports: [ConfigService, 'ConfigurationService'],
})
export class ConfigurationModule {}
