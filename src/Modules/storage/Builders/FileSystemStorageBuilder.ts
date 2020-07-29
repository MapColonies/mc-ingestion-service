import * as multer from 'multer';
import { normalize, join } from 'upath';
import { exists } from 'fs';
import * as fse from 'fs-extra';
import { MCLogger } from '@map-colonies/mc-logger';
import { ConfigService } from '../../configuration/ConfigService';

export class FileSystemStorageBuilder {
  constructor(private config: ConfigService, private logger: MCLogger) {}

  CreateStorage(): multer.StorageEngine {
    return multer.diskStorage({
      destination: this.createUploadFolder.bind(this),
      filename: (req, file, cb) => {
        cb(null, file.originalname);
      },
    });
  }

  private createUploadFolder(req, file: Express.Multer.File, cb) {
    const root = this.config.get('storage.FS.uploadRoot', null);
    if (!root || root == '') {
      this.logger.error(
        `FileSystemStorageBuilder - createUploadFolder - Failed to resolve file upload folder due to root directory configuration issue`
      );
      cb(
        'Failed to resolve file upload folder due to root directory configuration issue',
        ''
      );
      return;
    }

    const fileId = JSON.parse(req.body.additionalData).id;
    const productDir = `${fileId}`;
    const uploadDir = normalize(join(normalize(root), normalize(productDir)));
    this.logger.info(
      `FileSystemStorageBuilder - createUplandFolder - Uploading file to path: ${uploadDir}/${file.originalname}`
    );
    req.body.uploadDir = uploadDir;
    exists(uploadDir, exists => {
      if (exists) {
        cb(null, uploadDir);
      } else {
        fse.mkdirs(uploadDir, err => {
          if (err) {
            this.logger.error(
              `FileSystemStorageBuilder - createUplandFolder - Failed to create upload folder : ${uploadDir} with error : ${err.message}`
            );
            cb(
              'Failed to create upload folder: ' +
                uploadDir +
                'with error : ' +
                err.message,
              ''
            );
            return;
          }
          cb(null, uploadDir);
        });
      }
    });
  }
}
