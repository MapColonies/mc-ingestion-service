import { Module, HttpModule } from '@nestjs/common';
import { ImageIndexerHttpClient } from './ImageIndexer/ImageIndexerHttpClient';
import { WorkflowHttpClient } from './Workflow/WorkflowHttpClient';

@Module({
  imports: [HttpModule],
  providers: [ImageIndexerHttpClient, WorkflowHttpClient],
  exports: [ImageIndexerHttpClient, WorkflowHttpClient],
})
export class ServiceClientsModule {}
