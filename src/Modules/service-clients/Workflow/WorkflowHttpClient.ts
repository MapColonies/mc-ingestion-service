import { HttpClient } from '../HttpClient';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '../../configuration/ConfigService';
import { ImageMetadata } from '@map-colonies/mc-model-types';

export enum WorkflowAction {
  create = 'create',
  update = 'update',
}

@Injectable()
export class WorkflowHttpClient extends HttpClient {
  constructor(private config: ConfigService) {
    super(config.get('dependentServices.workflowBaseUrl'));
  }

  async ingest(
    imageMetadata: ImageMetadata,
    action: WorkflowAction
  ): Promise<void> {
    const url = 'ingest';
    await this.post<any>(url, {
      imageMetaData: imageMetadata,
      action: action.toString(),
    });
    return Promise.resolve();
  }
}
