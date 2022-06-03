import { INestApplicationContext } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  KeyGeneratorModule,
  KeyGeneratorService,
  LoggerService,
} from '../module';

(async (): Promise<void> => {
  const logger: LoggerService = new LoggerService(KeyGeneratorService.name);
  const app: INestApplicationContext =
    await NestFactory.createApplicationContext(KeyGeneratorModule, { logger });

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
