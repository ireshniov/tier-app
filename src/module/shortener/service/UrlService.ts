import { Injectable } from '@nestjs/common';
import { Url } from '../entity';
import { ShortenUrlDto } from '../dto';
import { KeyGeneratorService } from '../../key-generator';
import { UrlRepository } from '../repository';
import { UrlCacheService } from './UrlCacheService';

@Injectable()
export class UrlService {
  constructor(
    private readonly keyGeneratorService: KeyGeneratorService,
    private readonly urlRepository: UrlRepository,
    private readonly urlCacheService: UrlCacheService,
  ) {}

  async findDestinationByHash(hash: string): Promise<string | undefined> {
    return (
      (await this.urlCacheService.findDestinationByHash(hash)) ||
      (await this.urlRepository.findDestinationByHash(hash))
    );
  }

  async shorten({ url }: ShortenUrlDto): Promise<Url> {
    return (
      (await this.urlRepository.findOneByDestination(url)) ||
      (await this.create(url))
    );
  }

  async create(destination: string): Promise<Url> {
    const hash = await this.keyGeneratorService.getNotUsedHash();

    return await this.urlRepository.save({
      destination,
      hash,
    });
  }
}
