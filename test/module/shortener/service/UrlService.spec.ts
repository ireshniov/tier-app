import { TestingModule } from '@nestjs/testing';
import {
  KeyGeneratorCacheService,
  KeyGeneratorService,
  NotUsedHashRepository,
  REDIS_CONNECTION,
  UrlCacheService,
  UrlRepository,
  UrlService,
  Url,
} from '../../../../src';
import { createUnitTestingModule } from '../ShortenerModule.stub';
import { plainToClass } from 'class-transformer';

describe('UrlService', () => {
  let module: TestingModule;

  let urlService: UrlService;
  let urlCacheService: UrlCacheService;
  let urlRepository: UrlRepository;
  let keyGeneratorService: KeyGeneratorService;

  beforeEach(async () => {
    module = await createUnitTestingModule({
      providers: [
        UrlService,
        KeyGeneratorService,
        KeyGeneratorCacheService,
        NotUsedHashRepository,
        UrlRepository,
        UrlCacheService,
        {
          provide: REDIS_CONNECTION,
          useValue: jest.fn(),
        },
      ],
    });

    urlService = module.get(UrlService);
    urlCacheService = module.get(UrlCacheService);
    urlRepository = module.get(UrlRepository);
    keyGeneratorService = module.get(KeyGeneratorService);
  });

  afterEach(async () => {
    jest.clearAllMocks();

    await module.close();
  });

  describe('findDestinationByHash', () => {
    let urlCacheServiceFindDestinationByHashSpy: jest.SpyInstance;
    let urlRepositoryFindDestinationByHashSpy: jest.SpyInstance;

    beforeEach(() => {
      urlRepositoryFindDestinationByHashSpy = jest
        .spyOn(urlRepository, 'findDestinationByHash')
        .mockResolvedValue('http://test2.com');
    });

    it('Should return destination from cache', async () => {
      urlCacheServiceFindDestinationByHashSpy = jest
        .spyOn(urlCacheService, 'findDestinationByHash')
        .mockResolvedValue('http://test.com');

      const result = await urlService.findDestinationByHash('test1');

      expect(result).toEqual('http://test.com');
      expect(urlCacheServiceFindDestinationByHashSpy).toBeCalledWith('test1');
      expect(urlRepositoryFindDestinationByHashSpy).not.toBeCalled();
    });

    it('Should return destination from repository', async () => {
      urlCacheServiceFindDestinationByHashSpy = jest
        .spyOn(urlCacheService, 'findDestinationByHash')
        .mockResolvedValue(null);

      const result = await urlService.findDestinationByHash('test1');

      expect(result).toEqual('http://test2.com');
      expect(urlCacheServiceFindDestinationByHashSpy).toBeCalledWith('test1');
      expect(urlRepositoryFindDestinationByHashSpy).toBeCalledWith('test1');
    });
  });

  describe('shorten', () => {
    const givenUrl: Url = plainToClass(Url, {
      hash: 'test1',
      destination: 'http://test.com',
      createdAt: new Date('2022-06-01'),
    });

    const savedUrl: Url = plainToClass(Url, {
      hash: 'test2',
      destination: 'http://test.com',
      createdAt: new Date('2022-06-01'),
    });

    let urlRepositoryFindOneByDestinationSpy: jest.SpyInstance;
    let keyGeneratorServiceGetNotUsedHashSpy: jest.SpyInstance;
    let urlRepositorySaveSpy: jest.SpyInstance;

    beforeEach(() => {
      keyGeneratorServiceGetNotUsedHashSpy = jest
        .spyOn(keyGeneratorService, 'getNotUsedHash')
        .mockResolvedValue('test2');

      urlRepositorySaveSpy = jest
        .spyOn(urlRepository, 'save')
        .mockResolvedValue(savedUrl);
    });

    it('Should return url from DB that already exists', async () => {
      urlRepositoryFindOneByDestinationSpy = jest
        .spyOn(urlRepository, 'findOneByDestination')
        .mockResolvedValue(givenUrl);

      const result: Url = await urlService.shorten({ url: 'http://test.com' });

      expect(result).toBeInstanceOf(Url);
      expect(result.hash).toEqual('test1');
      expect(result.destination).toEqual('http://test.com');

      expect(urlRepositoryFindOneByDestinationSpy).toBeCalledWith(
        'http://test.com',
      );

      expect(keyGeneratorServiceGetNotUsedHashSpy).not.toBeCalled();
      expect(urlRepositorySaveSpy).not.toBeCalled();
    });

    it('Should create new url', async () => {
      urlRepositoryFindOneByDestinationSpy = jest
        .spyOn(urlRepository, 'findOneByDestination')
        .mockResolvedValue(undefined);

      const result: Url = await urlService.shorten({ url: 'http://test.com' });

      expect(result).toBeInstanceOf(Url);
      expect(result.hash).toEqual('test2');
      expect(result.destination).toEqual('http://test.com');

      expect(urlRepositoryFindOneByDestinationSpy).toBeCalledWith(
        'http://test.com',
      );

      expect(keyGeneratorServiceGetNotUsedHashSpy).toBeCalled();
      expect(urlRepositorySaveSpy).toBeCalledWith({
        hash: 'test2',
        destination: 'http://test.com',
      });
    });
  });
});
