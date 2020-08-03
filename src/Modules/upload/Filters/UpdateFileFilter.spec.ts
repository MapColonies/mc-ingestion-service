import { Test, TestingModule } from '@nestjs/testing';
import { UpdateFileFilter } from '././UpdateFileFilter';
import { ImageIndexerHttpClient } from '../../service-clients/ImageIndexer/ImageIndexerHttpClient';

describe('UpdateFileFilter', () => {
  let filter: UpdateFileFilter;
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
        UpdateFileFilter,
        { useValue: { exists: existsMock }, provide: ImageIndexerHttpClient },
      ],
    }).compile();

    filter = module.get<UpdateFileFilter>(UpdateFileFilter);
  });

  afterEach(() => {
    existsMock.mockReset();
    callback.mockReset();
  });

  it('Should allow upload when exists', async () => {
    expect.assertions(4);
    existsMock.mockResolvedValue(true);

    await filter.filter(requestMock, null, callback);

    expect(existsMock).toBeCalledTimes(1);
    expect(existsMock).toBeCalledWith(imageId);

    expect(callback).toBeCalledTimes(1);
    expect(callback).toBeCalledWith(null, true);
  });

  it('Should block upload when not exists', async () => {
    expect.assertions(4);
    existsMock.mockResolvedValue(false);

    await filter.filter(requestMock, null, callback);

    expect(existsMock).toBeCalledTimes(1);
    expect(existsMock).toBeCalledWith(imageId);

    expect(callback).toBeCalledTimes(1);
    expect(callback).toBeCalledWith(null, false);
  });
});
