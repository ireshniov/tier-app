import { INestApplicationContext } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { HashSeederModule, HashSeederService, LoggerService } from '../module';

(async (): Promise<void> => {
  const logger: LoggerService = new LoggerService(HashSeederModule.name);
  const app: INestApplicationContext =
    await NestFactory.createApplicationContext(HashSeederModule, { logger });

  await app.init();

  try {
    /**
     * @todo take hash length from cli args
     */
    await app.get(HashSeederService).seedNotUsedHash(3);
    process.exit(0);
  } catch (err: any) {
    logger.exception(err);
    process.exit(1);
  }
})();
