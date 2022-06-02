import { TestingModule } from '@nestjs/testing';
import {
  KeyGeneratorCacheService,
  KeyGeneratorService,
  NotUsedHashRepository,
  REDIS_CONNECTION,
  UrlByHashPipe,
  UrlCacheService,
  UrlRepository,
  UrlService,
} from '../../../../src';
import { createUnitTestingModule } from '../ShortenerModule.stub';
import { NotFoundException } from '@nestjs/common';

describe('UrlByHashPipe', () => {
  let module: TestingModule;

  let urlByHashPipe: UrlByHashPipe;
  let urlService: UrlService;

  beforeEach(async () => {
    module = await createUnitTestingModule({
      providers: [
        UrlByHashPipe,
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

    urlByHashPipe = module.get(UrlByHashPipe);
    urlService = module.get(UrlService);
  });

  afterEach(async () => {
    jest.clearAllMocks();

    await module.close();
  });

  describe('transform', () => {
    let urlServiceFindDestinationByHashSpy: jest.SpyInstance;

    it('Should throw 404 Not Found', async () => {
      urlServiceFindDestinationByHashSpy = jest
        .spyOn(urlService, 'findDestinationByHash')
        .mockResolvedValue(undefined);

      expect.assertions(4);

      try {
        await urlByHashPipe.transform('test1');
      } catch (error: any) {
        expect(urlServiceFindDestinationByHashSpy).toHaveBeenCalledWith(
          'test1',
        );
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toEqual('Not Found');
        expect(error.status).toEqual(404);
      }
    });

    it('Should return destination by hash', async () => {
      urlServiceFindDestinationByHashSpy = jest
        .spyOn(urlService, 'findDestinationByHash')
        .mockResolvedValue('http://test.com');

      const result: string = await urlByHashPipe.transform('test1');

      expect(result).toEqual('http://test.com');
    });
  });
});
