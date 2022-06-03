import { INestApplicationContext } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  CronKeyGeneratorSeedNotUsedHashModule,
  KeyGeneratorService,
  LoggerService,
} from '../module';

(async (): Promise<void> => {
  const logger: LoggerService = new LoggerService(
    CronKeyGeneratorSeedNotUsedHashModule.name,
  );
  const app: INestApplicationContext =
    await NestFactory.createApplicationContext(
      CronKeyGeneratorSeedNotUsedHashModule,
      { logger },
    );

  await app.init();

  try {
    /**
     * @todo take hash length from cli args
     */
    await app.get(KeyGeneratorService).seedNotUsedHash(3);
    process.exit(0);
  } catch (err: any) {
    logger.exception(err);
    process.exit(1);
  }
})();
