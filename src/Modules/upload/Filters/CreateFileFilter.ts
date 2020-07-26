import { IFileFilter } from '../Models/IFileFilter';
import { Injectable } from '@nestjs/common';
import { ImageIndexerHttpClient } from '../../service-clients/ImageIndexer/ImageIndexerHttpClient';
import multer from 'multer';

@Injectable()
export class CreateFileFilter implements IFileFilter {
  constructor(private indexer: ImageIndexerHttpClient) {}

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async filter(
    req: any,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
  ): Promise<void> {
    try {
      const id = JSON.parse(req.body.additionalData).id;
      const exists = await this.indexer.exists(id);
      if (exists) {
        cb(null, false);
      } else {
        cb(null, true);
      }
    } catch (error) {
      cb(error);
    }
  }
}
