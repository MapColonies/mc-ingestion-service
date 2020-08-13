import { Test, TestingModule } from '@nestjs/testing';
import { MCLogger } from '@map-colonies/mc-logger';
import { ImageMetadata } from '@map-colonies/mc-model-types';
import { UploadService } from './Upload.service';
import { ImageIndexerHttpClient } from '../../service-clients/ImageIndexer/ImageIndexerHttpClient';
import { WorkflowHttpClient } from '../../service-clients/Workflow/WorkflowHttpClient';
import { IUploadedFiles } from '../Models/IUploadedFiles';
import { CreateUploadRequest } from '../Models/CreateUploadRequest.entity';
import { UpdateUploadRequest } from '../Models/UpdateUploadRequest.entity';

describe('UploadService', () => {
  let service: UploadService;
  let ingestMock;

  const metadata: ImageMetadata = {
    id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    creationTime: new Date('2020-07-13T06:53:16.202Z'),
    imagingTime: new Date('2020-07-13T05:53:16.202Z'),
    resolution: 3.5,
    footprint: {
      type: 'Polygon',
      coordinates: [
        [
          [100, 0],
          [101, 0],
          [101, 1],
          [100, 1],
          [100, 0],
        ],
      ],
    },
    imageSection: 'north',
    height: 300,
    width: 500,
    sensorType: 'RGB',
    imageColorType: 'BW',
    imageBitPerPixel: 24,
    imageFormat: 'tiff',
    isBitSigned: true,
    imageSource: "layer's creator",
    cloudCoverPercentage: 93,
    geographicReferenceSystem: 4326,
  };
  const uploadedFiles: IUploadedFiles = {
    file: [
      {
        path: 'testImage',
        bucket: null,
        key: null,
        acl: null,
        contentType: null,
        contentDisposition: null,
        storageClass: null,
        serverSideEncryption: null,
        metadata: null,
        location: undefined,
        etag: null,
        fieldname: 'testImage',
        originalname: 'testImage',
        encoding: null,
        mimetype: null,
        size: 0,
        stream: null,
        destination: null,
        filename: null,
        buffer: null,
      },
    ],
    additionalFiles: [],
  };
  const expectedMetaDate: ImageMetadata = {
    ...metadata,
    additionalFilesUri: [],
    imageUri: 'testImage',
  };

  beforeEach(async () => {
    ingestMock = jest.fn();
    ingestMock.mockReturnValue(Promise.resolve());
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UploadService,
        { provide: MCLogger, useValue: {} },
        { provide: ImageIndexerHttpClient, useValue: {} },
        { provide: WorkflowHttpClient, useValue: { ingest: ingestMock } },
      ],
    }).compile();

    service = module.get<UploadService>(UploadService);
  });

  it('create should trigger workflow', () => {
    const req: CreateUploadRequest = {
      additionalData: { ...metadata },
      file: null,
      additionalFiles: null,
    };
    service.create(req, uploadedFiles);

    expect(ingestMock).toBeCalledWith(expectedMetaDate, 'create');
  });

  it('update should trigger workflow', () => {
    const req: UpdateUploadRequest = {
      additionalData: { ...metadata },
      file: null,
      additionalFiles: null,
    };
    service.update(req, uploadedFiles);

    expect(ingestMock).toBeCalledWith(expectedMetaDate, 'update');
  });
});
