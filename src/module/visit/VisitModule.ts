import { Module, ModuleMetadata } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UrlVisitInterceptor } from './interceptor';
import { connections } from '../../config/pubsub-connections';
import { UrlVisitController } from './controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { postgres } from '../../config/postgres.ormconfig';
import { VisitRepository } from './repository';
import { VisitService } from './service';
import { URL_VISIT_CLIENT_NAME, URL_VISIT_QUEUE } from './constants';

export const visitModuleMetadata: ModuleMetadata = {
  imports: [
    TypeOrmModule.forFeature([VisitRepository]),
    TypeOrmModule.forRoot(postgres),
    ClientsModule.register([
      {
        name: URL_VISIT_CLIENT_NAME,
        transport: Transport.RMQ,
        options: {
          urls: connections,
          queue: URL_VISIT_QUEUE,
        },
      },
    ]),
  ],
  controllers: [UrlVisitController],
  providers: [VisitService, UrlVisitInterceptor],
  exports: [UrlVisitInterceptor],
};

@Module(visitModuleMetadata)
export class VisitModule {}
