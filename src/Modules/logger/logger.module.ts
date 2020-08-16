import { Module, Global } from '@nestjs/common';
import { MCLogger, ILoggerConfig } from '@map-colonies/mc-logger';
import { readFileSync } from 'fs';
import * as config from 'config';
import { join } from 'path';

const getLogger = () => {
  const loggerConfig: ILoggerConfig = config.get('logger');
  const packagePath = join(__dirname, '../../../package.json');
  const packageData = readFileSync(packagePath, 'utf-8');
  const service = JSON.parse(packageData);

  return new MCLogger(loggerConfig, service);
};

@Global()
@Module({
  providers: [
    { provide: MCLogger, useValue: getLogger() },
    { provide: 'Logger', useExisting: MCLogger },
  ],
  exports: [MCLogger, 'Logger'],
})
export class LoggerModule {}
