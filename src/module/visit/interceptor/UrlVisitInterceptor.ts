import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ClientProxy } from '@nestjs/microservices';
import { getLocation } from '../../common';
import { UrlVisitedEvent } from '../event';
import { URL_VISIT_CLIENT_NAME } from '../constants';

@Injectable()
export class UrlVisitInterceptor implements NestInterceptor {
  constructor(
    @Inject(URL_VISIT_CLIENT_NAME)
    private readonly client: ClientProxy,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap(() => {
        const destination: string = getLocation(
          context.switchToHttp().getResponse(),
        );

        if (!destination.length) {
          // TODO probably throw an error here;
          return;
        }

        this.client.emit<void, UrlVisitedEvent>(UrlVisitedEvent.name, {
          hash: context.switchToHttp().getRequest().params.hash,
          destination,
          date: new Date(),
        });
      }),
    );
  }
}
