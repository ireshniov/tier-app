import { Module, ModuleMetadata } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from '../common';
import { UrlCacheService, UrlService } from './service';
import { CacheUrlInterceptor } from './interceptor';
import { UrlController } from './controller';
import { UrlByHashPipe, UrlDecoderPipe } from './pipe';
import { UrlRepository } from './repository';
import { postgres } from '../../config/postgres.ormconfig';
import { URL_VISIT_CLIENT_NAME, URL_VISIT_QUEUE, VisitModule } from '../visit';
import { KeyGeneratorModule } from '../key-generator';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { connections } from '../../config/pubsub-connections';

export const shortenerModuleMetadata: ModuleMetadata = {
  imports: [
    VisitModule,
    KeyGeneratorModule,
    RedisModule.register(process.env.REDIS_URL || 'redis://127.0.0.1:6379/1'),
    TypeOrmModule.forFeature([UrlRepository]),
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
  controllers: [UrlController],
  providers: [
    UrlService,
    UrlCacheService,
    UrlDecoderPipe,
    UrlByHashPipe,
    CacheUrlInterceptor,
  ],
};

@Module(shortenerModuleMetadata)
export class ShortenerModule {}
