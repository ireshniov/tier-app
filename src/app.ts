import { INestApplication } from '@nestjs/common';
import compression from 'compression';
import { json, urlencoded } from 'express';
import { LoggerService, LoggingInterceptor } from './module';

/**
 * @todo add swagger here
 */
export async function appBootstrap(
  app: INestApplication,
  _logger: LoggerService,
): Promise<INestApplication> {
  app.use(compression());
  app.use(json({ limit: '1mb' }));
  app.use(urlencoded({ limit: '1mb', extended: true }));

  app.enableShutdownHooks();
  app.useGlobalInterceptors(new LoggingInterceptor());

  app.enableCors();

  return app;
}

export function logServiceInfo(logger: LoggerService): void {
  const port: string | number = process.env.PORT || 3000;
  const rows: string[] = [
    'Service info:',
    `Node:       ${process.versions.node}`,
    `Platform:   ${process.env.npm_package_name!} (${process.env
      .npm_package_version!})`,
  ];

  if (process.env.NODE_ENV === 'development') {
    rows.push(`Localhost:  http://localhost:${port}`);

    if (process.env.SWAGGER_ENABLED === 'true') {
      rows.push(`Localhost:  http://localhost:${port}/api/`);
    }
  }

  const maxLength: number = Math.max(...rows.map((row: string) => row.length));
  const divider: string = new Array(maxLength).fill('-').join('');

  [divider, ...rows, divider].forEach((row: string) => {
    logger.debug(`| ${row.padEnd(maxLength, ' ')} |`);
  });
}
