import { TestingModule } from '@nestjs/testing';
import { createUnitTestingModule } from '../KeyGeneratorModule.stub';
import {
  KeyGeneratorCacheService,
  KeyGeneratorService,
  NotUsedHashRepository,
  UsedHashRepository,
} from '../../../../src';

describe('KeyGeneratorModule', () => {
  let module: TestingModule;

  let keyGeneratorCacheService: KeyGeneratorCacheService;
  let keyGeneratorService: KeyGeneratorService;
  let notUsedHashRepository: NotUsedHashRepository;

  beforeEach(async () => {
    module = await createUnitTestingModule({
      providers: [
        KeyGeneratorCacheService,
        KeyGeneratorService,
        NotUsedHashRepository,
        UsedHashRepository,
        { provide: 'REDIS_CONNECTION', useValue: jest.fn() },
      ],
    });

    keyGeneratorCacheService = module.get(KeyGeneratorCacheService);
    keyGeneratorService = module.get(KeyGeneratorService);
    notUsedHashRepository = module.get(NotUsedHashRepository);
  });

  afterEach(async () => {
    jest.clearAllMocks();

    await module.close();
  });

  describe('getNotUsedHash', () => {
    let keyGeneratorCacheServiceGetNotUsedHashSpy: jest.SpyInstance;
    let notUsedHashRepositoryGetOneHashMovedToUsedSpy: jest.SpyInstance;

    beforeEach(() => {
      notUsedHashRepositoryGetOneHashMovedToUsedSpy = jest
        .spyOn(notUsedHashRepository, 'getOneHashMovedToUsed')
        .mockResolvedValue('test2');
    });

    it('Should return cached not used hash', async () => {
      keyGeneratorCacheServiceGetNotUsedHashSpy = jest
        .spyOn(keyGeneratorCacheService, 'getOneNotUsedHash')
        .mockResolvedValue('test1');

      const result = await keyGeneratorService.getNotUsedHash();

      expect(keyGeneratorCacheServiceGetNotUsedHashSpy).toHaveBeenCalled();
      expect(
        notUsedHashRepositoryGetOneHashMovedToUsedSpy,
      ).not.toHaveBeenCalled();
      expect(result).toEqual('test1');
    });

    it('Should return not used hash from repository', async () => {
      keyGeneratorCacheServiceGetNotUsedHashSpy = jest
        .spyOn(keyGeneratorCacheService, 'getOneNotUsedHash')
        .mockResolvedValueOnce(null);

      const result = await keyGeneratorService.getNotUsedHash();

      expect(keyGeneratorCacheServiceGetNotUsedHashSpy).toHaveBeenCalled();
      expect(notUsedHashRepositoryGetOneHashMovedToUsedSpy).toHaveBeenCalled();
      expect(result).toEqual('test2');
    });
  });
});
