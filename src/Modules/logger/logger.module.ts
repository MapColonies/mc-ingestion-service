import { Module, Global } from '@nestjs/common';
import { Logger } from './Logger';

@Global()
@Module({
  providers: [Logger],
  exports: [Logger],
})
export class LoggerModule {}
