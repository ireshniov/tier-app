import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UrlCacheService } from '../service';
import { getLocation, Logger, LoggerService } from '../../common';

@Injectable()
export class CacheUrlInterceptor implements NestInterceptor {
  @Logger()
  private readonly logger: LoggerService;

  constructor(private readonly urlCacheService: UrlCacheService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap(async () => {
        const hash: string = context.switchToHttp().getRequest().params.hash;

        if (await this.urlCacheService.hasDestinationByHash(hash)) {
          this.logger.debug(`Url with hash ${hash} is already cached`);
          return;
        }

        const destination: string = getLocation(
          context.switchToHttp().getResponse(),
        );

        if (!destination.length) {
          return;
        }

        await this.urlCacheService.cacheVisitedUrl({
          hash,
          destination,
        });
      }),
    );
  }
}
