import { Test, TestingModule } from '@nestjs/testing';
import { CreateFileFilter } from './CreateFileFilter';
import { ImageIndexerHttpClient } from '../../service-clients/ImageIndexer/ImageIndexerHttpClient';

describe('CreateFileFilter', () => {
  let filter: CreateFileFilter;
  const existsMock = jest.fn();
  const callback = jest.fn();
  const requestMock = { body: { id: 'testId' } };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateFileFilter,
        { useValue: { exists: existsMock }, provide: ImageIndexerHttpClient },
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
    expect(existsMock).toBeCalledWith(requestMock.body.id);

    expect(callback).toBeCalledTimes(1);
    expect(callback).toBeCalledWith(null, false);
  });

  it('Should allow upload when not exists', async () => {
    expect.assertions(4);
    existsMock.mockResolvedValue(false);

    await filter.filter(requestMock, null, callback);

    expect(existsMock).toBeCalledTimes(1);
    expect(existsMock).toBeCalledWith(requestMock.body.id);

    expect(callback).toBeCalledTimes(1);
    expect(callback).toBeCalledWith(null, true);
  });
});
