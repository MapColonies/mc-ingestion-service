import { Test, TestingModule } from '@nestjs/testing';
import { CreateFileFilter } from './CreateFileFilter';
import { ImageIndexerHttpClient } from '../../service-clients/ImageIndexer/ImageIndexerHttpClient';

describe('CreateFileFilter', () => {
  let filter: CreateFileFilter;
  const existsMock = jest.fn();
  const callback = jest.fn();
  const imageId = 'testId';
  const requestMock = {
    body: {
      additionalData: `{"id": "${imageId}" }`,
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateFileFilter,
        { provide: ImageIndexerHttpClient, useValue: { exists: existsMock } },
      ],
    }).compile();

    filter = module.get<CreateFileFilter>(CreateFileFilter);
  });

  afterEach(() => {
    existsMock.mockReset();
    callback.mockReset();
  });

  it('Should block upload when exists', async () => {
    expect.assertions(4);
    existsMock.mockResolvedValue(true);

    await filter.filter(requestMock, null, callback);

    expect(existsMock).toBeCalledTimes(1);
    expect(existsMock).toBeCalledWith(imageId);

    expect(callback).toBeCalledTimes(1);
    expect(callback).toBeCalledWith(null, false);
  });

  it('Should allow upload when not exists', async () => {
    expect.assertions(4);
    existsMock.mockResolvedValue(false);

    await filter.filter(requestMock, null, callback);

    expect(existsMock).toBeCalledTimes(1);
    expect(existsMock).toBeCalledWith(imageId);

    expect(callback).toBeCalledTimes(1);
    expect(callback).toBeCalledWith(null, true);
  });
});
