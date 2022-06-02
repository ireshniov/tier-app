import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { UrlService } from '../service';

@Injectable()
export class UrlByHashPipe implements PipeTransform<string, Promise<string>> {
  constructor(private readonly urlService: UrlService) {}

  async transform(hash: string): Promise<string> {
    const destination: string | undefined =
      await this.urlService.findDestinationByHash(hash);

    if (!destination) {
      throw new NotFoundException();
    }

    return destination;
  }
}
