import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Response,
  UseInterceptors,
} from '@nestjs/common';
import { UrlService } from '../service';
import { getValidationPipeOf } from '../../common';
import { Url } from '../entity';
import { ShortenUrlDto } from '../dto';
import { UrlByHashPipe, UrlDecoderPipe } from '../pipe';
import { CacheUrlInterceptor } from '../interceptor';
import { UrlVisitInterceptor } from '../../visit';
import { Response as ExpressResponse } from 'express';

@Controller()
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async shorten(
    @Body(getValidationPipeOf(ShortenUrlDto), UrlDecoderPipe)
    shortenUrlDto: ShortenUrlDto,
  ): Promise<Url> {
    return await this.urlService.shorten(shortenUrlDto);
  }

  @UseInterceptors(CacheUrlInterceptor, UrlVisitInterceptor)
  @Get(':hash')
  @HttpCode(HttpStatus.FOUND)
  async redirect(
    @Param('hash', UrlByHashPipe) url: string,
    @Response() response: ExpressResponse,
  ): Promise<void> {
    return response.redirect(url);
  }
}
