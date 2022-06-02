import { Injectable, PipeTransform } from '@nestjs/common';

import { ShortenUrlDto } from '../dto';

@Injectable()
export class UrlDecoderPipe
  implements PipeTransform<ShortenUrlDto, Promise<ShortenUrlDto>>
{
  async transform({ url }: ShortenUrlDto): Promise<ShortenUrlDto> {
    return {
      url: decodeURIComponent(url),
    };
  }
}
