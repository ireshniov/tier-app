import { Inject, Injectable } from '@nestjs/common';
import { Logger, LoggerService, REDIS_CONNECTION } from '../../common';
import { Redis } from 'ioredis';

export interface ICacheVisitedUrl {
  hash: string;
  destination: string;
}

@Injectable()
export class UrlCacheService {
  @Logger()
  private readonly logger: LoggerService;

  constructor(
    @Inject(REDIS_CONNECTION)
    private readonly redis: Redis,
  ) {}

  async hasDestinationByHash(hash: string): Promise<boolean> {
    return (await this.redis.exists(`url:${hash}`)) === 1;
  }

  async findDestinationByHash(hash: string): Promise<string | null> {
    return await this.redis.get(`url:${hash}`);
  }

  async cacheVisitedUrl({
    hash,
    destination,
  }: ICacheVisitedUrl): Promise<void> {
    const expire: number = Number(process.env.URL_HASH_CACHE_TTL) || 86400;

    await this.redis.set(`url:${hash}`, destination, 'EX', expire, 'NX');

    this.logger.debug(
      `Url with hash ${hash} was cached and will expire in ${expire} seconds`,
    );
  }
}
