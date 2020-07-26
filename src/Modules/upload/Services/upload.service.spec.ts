import { Test, TestingModule } from '@nestjs/testing';
import { UploadService } from './Upload.service';
import { Logger } from '../../logger/Logger';

describe('UploadService', () => {
  let service: UploadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UploadService, { provide: Logger, useValue: {} }],
    }).compile();

    service = module.get<UploadService>(UploadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
