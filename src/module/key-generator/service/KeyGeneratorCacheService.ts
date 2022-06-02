import { Inject, Injectable } from '@nestjs/common';
import { Logger, LoggerService } from '../../common';
import { Redis } from 'ioredis';

export const HASH_SET_CACHE_KEY = 'hashes';

@Injectable()
export class KeyGeneratorCacheService {
  @Logger()
  private logger: LoggerService;

  constructor(
    @Inject('REDIS_CONNECTION')
    private readonly redis: Redis,
  ) {}

  async getOneNotUsedHash(): Promise<string | null> {
    return await this.redis.spop(HASH_SET_CACHE_KEY);
  }

  async getAmountToAdd(count: number): Promise<number> {
    const number = await this.redis.scard(HASH_SET_CACHE_KEY);

    return count - number;
  }

  async addHashes(hashes: string[]): Promise<void> {
    const number: number = await this.redis.sadd(HASH_SET_CACHE_KEY, hashes);

    this.logger.debug(`Added ${number} hashes`);
  }
}
