import { Module, HttpModule } from '@nestjs/common';
import { ImageIndexerHttpClient } from './ImageIndexer/ImageIndexerHttpClient';

@Module({
  imports: [HttpModule],
  providers: [ImageIndexerHttpClient],
  exports: [ImageIndexerHttpClient],
})
export class ServiceClientsModule {}
