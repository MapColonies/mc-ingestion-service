import { Test, TestingModule } from '@nestjs/testing';
import { MCLogger } from '@map-colonies/mc-logger';
import { UploadService } from './Upload.service';
import { ImageIndexerHttpClient } from '../../service-clients/ImageIndexer/ImageIndexerHttpClient';

describe('UploadService', () => {
  let service: UploadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UploadService,
        { provide: MCLogger, useValue: {} },
        { provide: ImageIndexerHttpClient, useValue: {} },
      ],
    }).compile();

    service = module.get<UploadService>(UploadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
