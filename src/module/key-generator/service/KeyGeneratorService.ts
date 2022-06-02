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

    const readableStream = HashStreamFactory.createHashReadableStream(
      await this.notUsedHashRepository.getMovedToUsed(amountToAdd),
    );

    const writableStream = HashStreamFactory.createHashWritableStream(
      this.keyGeneratorCacheService,
    );

    return new Promise((resolve, reject) => {
      readableStream
        .pipe(writableStream)
        .on('error', (error: any) => {
          reject(error);
        })
        .on('finish', async () => {
          this.logger.info('Stream closed');
          resolve();
        });
    });
  }
}
