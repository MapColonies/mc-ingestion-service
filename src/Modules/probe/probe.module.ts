import { Module, Global } from '@nestjs/common';
import { MCLogger } from '@map-colonies/mc-logger';
import { ConfigService } from '../configuration/ConfigService';
import { Probe } from '@map-colonies/mc-probe';
import { ConfigurationModule } from '../configuration/configuration.module';
import { LoggerModule } from '../logger/logger.module';

const probeFactory = (config: ConfigService, logger: MCLogger) => {
  const probeConfig = config.has('probe') ? config.get('probe') : {};
  const prob = new Probe(logger, probeConfig);
  return prob;
};

@Global()
@Module({
  imports: [ConfigurationModule, LoggerModule],
  providers: [
    {
      provide: Probe,
      useFactory: probeFactory,
      inject: [ConfigService, MCLogger],
    },
  ],
  exports: [Probe],
})
export class ProbeModule {}
