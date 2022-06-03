import { Injectable } from '@nestjs/common';
import { NotUsedHashRepository } from '../repository';
import { KeyGeneratorCacheService } from './KeyGeneratorCacheService';
import { Logger, LoggerService } from '../../common';
import { HashStreamFactory } from '../stream';

@Injectable()
export class KeyGeneratorService {
  @Logger()
  private readonly logger: LoggerService;

  constructor(
    private readonly notUsedHashRepository: NotUsedHashRepository,
    private readonly keyGeneratorCacheService: KeyGeneratorCacheService,
  ) {}

  async getNotUsedHash(): Promise<string> {
    return (
      (await this.keyGeneratorCacheService.getOneNotUsedHash()) ||
      (await this.notUsedHashRepository.getOneHashMovedToUsed())
    );
  }

  async refreshHashes(count: number): Promise<void> {
    const amountToAdd: number =
      await this.keyGeneratorCacheService.getAmountToAdd(count);

    if (amountToAdd <= 0) {
      return;
    }

    return new Promise(async (resolve, reject) => {
      const readableStream = HashStreamFactory.createHashReadableStream(
        await this.notUsedHashRepository.getMovedToUsed(amountToAdd),
      ).on('error', (error: any) => {
        reject(error);
      });

      const writableStream = HashStreamFactory.createHashWritableStream(
        this.keyGeneratorCacheService,
      );

      readableStream
        .pipe(writableStream, { end: true })
        .on('error', (error: any) => {
          reject(error);
        })
        .on('finish', async () => {
          this.logger.info('Reset cache finished');
          resolve(undefined);
        });
    });
  }
}
