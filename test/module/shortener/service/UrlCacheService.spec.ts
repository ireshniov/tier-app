import { TestingModule } from '@nestjs/testing';
import { REDIS_CONNECTION, UrlCacheService } from '../../../../src';
import { createUnitTestingModule } from '../ShortenerModule.stub';
import { Redis } from 'ioredis';

describe('UrlCacheService', () => {
  let module: TestingModule;

  let urlCacheService: UrlCacheService;
  let redisConnection: Redis;

  beforeEach(async () => {
    module = await createUnitTestingModule({
      providers: [
        UrlCacheService,
        {
          provide: REDIS_CONNECTION,
          useValue: {
            exists: () => jest.fn(),
            get: () => jest.fn(),
            set: () => jest.fn(),
          },
        },
      ],
    });

    urlCacheService = module.get(UrlCacheService);
    redisConnection = module.get(REDIS_CONNECTION);

    console.debug = jest.fn();
  });

  afterEach(async () => {
    jest.clearAllMocks();

    await module.close();
  });

  describe('hasDestinationByHash', () => {
    let redisExistsSpy: jest.SpyInstance;

    test.each([
      [0, false],
      [1, true],
    ])(
      'When from cache returns %p should return %p',
      async (arg: number, expected: boolean) => {
        redisExistsSpy = jest
          .spyOn(redisConnection, 'exists')
          .mockResolvedValue(arg as never);

        const result: boolean = await urlCacheService.hasDestinationByHash(
          'test1',
        );

        expect(result).toEqual(expected);
        expect(redisExistsSpy).toBeCalledWith('url:test1');
      },
    );
  });

  describe('findDestinationByHash', () => {
    let redisGetSpy: jest.SpyInstance;

    test.each(['http://test.com', null])(
      'Should return %p',
      async (foundValue: string | null) => {
        redisGetSpy = jest
          .spyOn(redisConnection, 'get')
          .mockResolvedValue(foundValue);

        const result: string | null =
          await urlCacheService.findDestinationByHash('test1');

        expect(result).toEqual(foundValue);
        expect(redisGetSpy).toBeCalledWith('url:test1');
      },
    );
  });

  describe('cacheVisitedUrl', () => {
    let redisSet: jest.SpyInstance;

    it('Should set key-value with expiration', async () => {
      redisSet = jest
        .spyOn(redisConnection, 'set')
        .mockResolvedValue('OK' as never);

      await urlCacheService.cacheVisitedUrl({
        hash: 'test1',
        destination: 'http://test.com',
      });

      expect(redisSet).toBeCalledWith(
        'url:test1',
        'http://test.com',
        'EX',
        86400,
        'NX',
      );
    });
  });
});
