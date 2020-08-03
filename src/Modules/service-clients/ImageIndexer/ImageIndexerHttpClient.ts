import { HttpClient } from '../HttpClient';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '../../configuration/ConfigService';
import { ApiHttpResponse, ImageMetadata } from '@map-colonies/mc-model-types';

@Injectable()
export class ImageIndexerHttpClient extends HttpClient {
  constructor(private config: ConfigService) {
    super(config.get('dependentServices.imageIndexerBaseUrl'));
  }

  async exists(id: string): Promise<boolean> {
    const url = `exists/${id}`;
    const res = await this.get<any>(url);
    return res.data.data.exists;
  }

  async getById(id: string): Promise<ImageMetadata> {
    const url = `/${id}`;
    const res = await this.get<ApiHttpResponse>(url);
    return res.data.data;
  }
}
