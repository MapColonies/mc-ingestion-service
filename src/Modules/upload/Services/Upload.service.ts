import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ApiHttpResponse, ImageMetadata } from '@map-colonies/mc-model-types';
import { MCLogger } from '@map-colonies/mc-logger';
import { UpdateUploadRequest } from '../Models/UpdateUploadRequest.entity';
import { CreateUploadRequest } from '../Models/CreateUploadRequest.entity';
import { ImageIndexerHttpClient } from '../../service-clients/ImageIndexer/ImageIndexerHttpClient';
import { IUploadedFiles } from '../Models/IUploadedFiles';
import {
  WorkflowHttpClient,
  WorkflowAction,
} from '../../service-clients/Workflow/WorkflowHttpClient';

@Injectable()
export class UploadService {
  constructor(
    private indexer: ImageIndexerHttpClient,
    private logger: MCLogger,
    private workflow: WorkflowHttpClient
  ) {}

  async create(
    request: CreateUploadRequest,
    files: IUploadedFiles
  ): Promise<ApiHttpResponse> {
    const metadata = request.additionalData;
    this.setFilesUris(files, metadata);
    await this.workflow.ingest(metadata, WorkflowAction.create);
    return this.createResponse(metadata);
  }

  private setFilesUris(
    files: IUploadedFiles,
    metadata: ImageMetadata,
    requireMainFile = true
  ) {
    if (!files.file) {
      if (requireMainFile) {
        throw new BadRequestException('file is missing');
      }
    } else {
      if (files.file[0]) {
        metadata.imageUri = files.file[0].path || files.file[0].location;
      }
    }
    metadata.additionalFilesUri = files.additionalFiles?.map(
      file => file.path || file.location
    );
  }

  async update(
    request: UpdateUploadRequest,
    files: IUploadedFiles
  ): Promise<ApiHttpResponse> {
    const metadata = request.additionalData;
    this.setFilesUris(files, metadata);
    await this.workflow.ingest(metadata, WorkflowAction.update);
    return this.createResponse(null);
  }

  async find(id: string): Promise<ApiHttpResponse> {
    const metaDate = await this.indexer.getById(id);
    return this.createResponse(metaDate);
  }

  delete(id: string): ApiHttpResponse {
    throw new InternalServerErrorException('not implemented');
    return this.createResponse(null);
  }

  private createResponse(data: ImageMetadata): ApiHttpResponse {
    //error are handled in the global error middleware
    const response: ApiHttpResponse = {
      success: true,
      data: data,
    };
    return response;
  }
}
