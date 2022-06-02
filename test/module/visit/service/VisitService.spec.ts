import { TestingModule } from '@nestjs/testing';
import { createUnitTestingModule } from '../VisitModule.stub';
import { VisitRepository, VisitService } from '../../../../src';

describe('VisitService', () => {
  let module: TestingModule;

  let visitService: VisitService;
  let visitRepository: VisitRepository;

  beforeEach(async () => {
    module = await createUnitTestingModule({
      providers: [VisitService, VisitRepository],
    });

    visitService = module.get(VisitService);
    visitRepository = module.get(VisitRepository);
  });

  afterEach(async () => {
    jest.clearAllMocks();

    await module.close();
  });

  describe('create', () => {
    let visitRepositorySaveSpy: jest.SpyInstance;

    beforeEach(() => {
      visitRepositorySaveSpy = jest
        .spyOn(visitRepository, 'save')
        .mockResolvedValue({
          id: 1,
          hash: 'test1',
          destination: 'http://test.com',
          date: new Date('2022-06-01'),
        });
    });

    it('Should save visit', async () => {
      await visitService.create({
        hash: 'test1',
        destination: 'http://test.com',
        date: new Date('2022-06-01'),
      });

      expect(visitRepositorySaveSpy).toHaveBeenCalledWith({
        hash: 'test1',
        destination: 'http://test.com',
        date: new Date('2022-06-01'),
      });
    });
  });
});
