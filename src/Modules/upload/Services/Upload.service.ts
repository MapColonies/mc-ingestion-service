import { Injectable, BadRequestException } from '@nestjs/common';
import { ApiHttpResponse, ImageMetadata } from 'mc-model-types';
import { MCLogger } from '@map-colonies/mc-logger';
import { UpdateUploadRequest } from '../Models/UpdateUploadRequest.entity';
import { CreateUploadRequest } from '../Models/CreateUploadRequest.entity';
import { ImageIndexerHttpClient } from '../../service-clients/ImageIndexer/ImageIndexerHttpClient';
import { IUploadedFiles } from '../Models/IUploadedFiles';

@Injectable()
export class UploadService {
  constructor(
    private indexer: ImageIndexerHttpClient,
    private logger: MCLogger
  ) {}

  create(request: CreateUploadRequest, files: IUploadedFiles): ApiHttpResponse {
    const metadata = request.additionalData;
    if (!files.file) {
      throw new BadRequestException('file is missing');
    }
    const hasPath = !!files.file[0].path;
    if (files.file[0]) {
      metadata.imageUri = hasPath ? files.file[0].path : files.file[0].location;
    }
    metadata.additionalFilesUri = files.additionalFiles?.map(file =>
      hasPath ? file.path : file.location
    );
    //TODO: send image metadata to stratego
    return this.createResponse(metadata);
  }

  update(request: UpdateUploadRequest, files: IUploadedFiles): ApiHttpResponse {
    //TODO:send request to stratego
    return this.createResponse(null);
  }

  async find(id: string): Promise<ApiHttpResponse> {
    const metaDate = await this.indexer.getById(id);
    return this.createResponse(metaDate);
  }

  delete(id: string): ApiHttpResponse {
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
