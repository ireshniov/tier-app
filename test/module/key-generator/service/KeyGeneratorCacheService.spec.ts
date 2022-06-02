import { TestingModule } from '@nestjs/testing';
import { createUnitTestingModule } from '../KeyGeneratorModule.stub';
import { KeyGeneratorCacheService, REDIS_CONNECTION } from '../../../../src';
import { Redis } from 'ioredis';

describe('KeyGeneratorCacheService', () => {
  let module: TestingModule;

  let keyGeneratorCacheService: KeyGeneratorCacheService;
  let redisConnection: Redis;

  beforeEach(async () => {
    module = await createUnitTestingModule({
      providers: [
        KeyGeneratorCacheService,
        {
          provide: REDIS_CONNECTION,
          useValue: {
            spop: () => jest.fn(),
            scard: () => jest.fn(),
            sadd: () => jest.fn(),
          },
        },
      ],
    });

    keyGeneratorCacheService = module.get(KeyGeneratorCacheService);
    redisConnection = module.get(REDIS_CONNECTION);
  });

  afterEach(async () => {
    jest.clearAllMocks();

    await module.close();
  });

  describe('getOneNotUsedHash', () => {
    let redisSpopSpy: jest.SpyInstance;

    test.each(['test1', null])(
      'Should return %p',
      async (foundValue: string | null) => {
        redisSpopSpy = jest
          .spyOn(redisConnection, 'spop')
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          .mockResolvedValue(foundValue);

        const result: string | null =
          await keyGeneratorCacheService.getOneNotUsedHash();

        expect(result).toEqual(foundValue);
        expect(redisSpopSpy).toBeCalledWith('hashes');
      },
    );
  });

  describe('getAmountToAdd', () => {
    let redisScardSpy: jest.SpyInstance;

    test.each([
      [8, 10, 2],
      [7, 7, 0],
    ])(
      'Having %p hashes in cache and need %p count of cached hashes. Should return %p',
      async (number: number, count: number, amount: number) => {
        redisScardSpy = jest
          .spyOn(redisConnection, 'scard')
          .mockResolvedValue(number);

        const result: number = await keyGeneratorCacheService.getAmountToAdd(
          count,
        );

        expect(result).toEqual(amount);
        expect(redisScardSpy).toBeCalledWith('hashes');
      },
    );
  });

  describe('addHashes', () => {
    let redisSaddSpy: jest.SpyInstance;

    it('Should add multiple hashes in cache', async () => {
      redisSaddSpy = jest.spyOn(redisConnection, 'sadd').mockResolvedValue(2);

      await keyGeneratorCacheService.addHashes(['test1', 'test2']);

      expect(redisSaddSpy).toBeCalledWith('hashes', ['test1', 'test2']);
    });
  });
});
