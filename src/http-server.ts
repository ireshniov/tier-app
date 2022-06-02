import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { appBootstrap, logServiceInfo } from './app';
import { AppModule, LoggerService, URL_VISIT_QUEUE } from './module';
import { Transport } from '@nestjs/microservices';
import { RmqOptions } from '@nestjs/microservices/interfaces/microservice-configuration.interface';
import { connections } from './config/pubsub-connections';

async function bootstrap(logger: LoggerService): Promise<INestApplication> {
  const app: INestApplication = await NestFactory.create(AppModule, {
    logger,
  });

  app.connectMicroservice<RmqOptions>({
    transport: Transport.RMQ,
    options: {
      urls: connections,
      queue: URL_VISIT_QUEUE,
      noAck: false,
      queueOptions: {
        durable: true,
      },
    },
  });

  await appBootstrap(app, logger);

  const port: number | string = `${process.env.SERVER_PORT}` || 3000;

  await app.listen(port);
  await app.startAllMicroservices();

  logServiceInfo(logger);

  return app;
}

(async (): Promise<void> => {
  const logger: LoggerService = new LoggerService(AppModule.name);

  await bootstrap(logger);
})();
