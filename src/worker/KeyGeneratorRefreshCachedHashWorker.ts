import { INestApplicationContext } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  CronKeyGeneratorRefreshCachedHashModule,
  KeyGeneratorService,
  LoggerService,
} from '../module';

(async (): Promise<void> => {
  const logger: LoggerService = new LoggerService(
    CronKeyGeneratorRefreshCachedHashModule.name,
  );
  const app: INestApplicationContext =
    await NestFactory.createApplicationContext(
      CronKeyGeneratorRefreshCachedHashModule,
      { logger },
    );

  await app.init();

  try {
    await app
      .get(KeyGeneratorService)
      .refreshHashes(Number(process.env.CACHE_HASH_COUNT) || 1000);
    process.exit(0);
  } catch (err: any) {
    logger.exception(err);
    process.exit(1);
  }
})();
