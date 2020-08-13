import { Test, TestingModule } from '@nestjs/testing';
import { MCLogger } from '@map-colonies/mc-logger';
import { UploadController } from './upload.controller';
import { UploadService } from '../Services/Upload.service';
import { ImageIndexerHttpClient } from '../../service-clients/ImageIndexer/ImageIndexerHttpClient';
import { ConfigService } from '../../configuration/ConfigService';
import { StorageEngineFactory } from '../../storage/StorageEngineFactory';
import { WorkflowHttpClient } from '../../service-clients/Workflow/WorkflowHttpClient';

describe('Upload Controller', () => {
  let controller: UploadController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadController],
      providers: [
        { provide: UploadService, useValue: {} },
        { provide: ImageIndexerHttpClient, useValue: {} },
        { provide: ConfigService, useValue: {} },
        { provide: MCLogger, useValue: {} },
        { provide: StorageEngineFactory, useValue: {} },
        { provide: WorkflowHttpClient, useValue: {} },
      ],
    }).compile();

    controller = module.get<UploadController>(UploadController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
