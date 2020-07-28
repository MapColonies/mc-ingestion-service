import { Injectable } from '@nestjs/common';
import multer from 'multer';
import { MCLogger } from '@map-colonies/mc-logger';
import { S3StorageBuilder } from './Builders/S3StorageBuilder';
import { FileSystemStorageBuilder } from './Builders/FileSystemStorageBuilder';
import { ConfigService } from '../configuration/ConfigService';

@Injectable()
export class StorageEngineFactory {
  private instance: multer.StorageEngine;

  getStorage(config: ConfigService, logger: MCLogger): multer.StorageEngine {
    if (!this.instance) {
      this.instance = this.createStorage(config, logger);
    }
    return this.instance;
  }

  private createStorage(
    config: ConfigService,
    logger: MCLogger
  ): multer.StorageEngine {
    logger.info(
      `StorageEngineFactory - createStorage - storage engine: ${config.get(
        'storage.engine'
      )}`
    );

    switch (config.get('storage.engine')) {
      case 'S3':
        return new S3StorageBuilder(config, logger).CreateStorage();
      case 'FS':
        return new FileSystemStorageBuilder(config, logger).CreateStorage();
      default:
        logger.error(
          `StorageEngineFactory - createStorage - Unsupported storage type ${config.get(
            'storage.engine'
          )} in configuration.`
        );
        process.exit(1);
    }
  }
}
