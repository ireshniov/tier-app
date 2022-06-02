import { TestingModule } from '@nestjs/testing';
import { UrlDecoderPipe } from '../../../../src';
import { createUnitTestingModule } from '../ShortenerModule.stub';

describe('UrlDecoderPipe', () => {
  let module: TestingModule;

  let urlDecoderPipe: UrlDecoderPipe;

  beforeEach(async () => {
    module = await createUnitTestingModule({
      providers: [UrlDecoderPipe],
    });

    urlDecoderPipe = module.get(UrlDecoderPipe);
  });

  afterEach(async () => {
    jest.clearAllMocks();

    await module.close();
  });

  describe('transform', () => {
    it('Should decode url', async () => {
      const result = await urlDecoderPipe.transform({
        url: 'http://test.com/test%3Fid%3Dtest',
      });

      expect(result).toEqual({
        url: 'http://test.com/test?id=test',
      });
    });
  });
});
