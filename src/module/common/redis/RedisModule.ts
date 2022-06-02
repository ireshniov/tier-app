import { DynamicModule, Module, Provider } from '@nestjs/common';
import IoRedis, { Redis, RedisOptions } from 'ioredis';
import { LoggerService } from '../logger';

export const REDIS_OPTIONS = 'REDIS_OPTIONS';
export const REDIS_CONNECTION = 'REDIS_CONNECTION';

export function createRedisClient(
  loggerContext: string,
  url: string,
  redisOptions: RedisOptions = {},
): Redis {
  const logger: LoggerService = new LoggerService(loggerContext);

  const redisClient = new IoRedis(url, {
    maxRetriesPerRequest: null,
    showFriendlyErrorStack: true,
    ...redisOptions,
  });

  redisClient.on('error', (error: Error) => {
    logger.exception(error);
  });

  return redisClient;
}

export function createRedisProviders(
  url: string,
  options: RedisOptions = {},
): Provider[] {
  return [
    {
      provide: REDIS_OPTIONS,
      useValue: options,
    },
    {
      provide: REDIS_CONNECTION,
      useValue: createRedisClient('RedisModule', url, options),
    },
  ];
}

@Module({})
export class RedisModule {
  static register(url: string, options: RedisOptions = {}): DynamicModule {
    const providers: Provider[] = createRedisProviders(url, options);

    return {
      module: RedisModule,
      providers: providers,
      exports: providers,
    };
  }
}
