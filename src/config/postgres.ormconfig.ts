import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { Url } from '../module/shortener/entity';
import { NotUsedHash, UsedHash } from '../module/key-generator/entity';
import { UrlEntitySubscriber } from '../module';
import { Visit } from '../module/visit/entity/Visit';
import { DEFAULT_CONNECTION_NAME } from '@nestjs/typeorm/dist/typeorm.constants';

const isDevEnv: boolean = 'development' === process.env.NODE_ENV;
const basePath: string = isDevEnv && process.env.TS_NODE ? '' : 'dist/';

export const postgres: PostgresConnectionOptions = {
  name: DEFAULT_CONNECTION_NAME,
  type: 'postgres',
  url: process.env.DB_URL,
  entities: [NotUsedHash, UsedHash, Url, Visit],
  subscribers: [UrlEntitySubscriber],
  synchronize: false,
  logging:
    process.env.DB_LOGGING === 'true' ? true : (process.env.DB_LOGGING as any),
  migrations: [`${basePath}/src/migration/postgres/*{.ts,.js}`],
  migrationsTableName: 'migrations',
  migrationsTransactionMode: 'each',
  migrationsRun: false,
  cli: {
    migrationsDir: `${basePath}/src/migration/postgres`,
  },
  namingStrategy: new SnakeNamingStrategy(),
};
