import { Pool, PoolClient } from 'pg';
import { getConnection } from 'typeorm';
import { PostgresDriver } from 'typeorm/driver/postgres/PostgresDriver';
import { CopyStreamQuery, from } from 'pg-copy-streams';
import { HashStreamFactory } from '../stream';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HashSeederService {
  async seedNotUsedHash(hashLength: number): Promise<void> {
    const pool: Pool = (getConnection().driver as PostgresDriver).master;

    const client: PoolClient = await pool.connect();

    const stream: CopyStreamQuery = client.query(
      from('COPY not_used_hashes FROM STDIN'),
    );

    const readable =
      HashStreamFactory.createGeneratedHashReadableStream(hashLength);

    return new Promise((resolve, reject) => {
      readable
        .pipe(HashStreamFactory.createHashToCsvTransformStream())
        .pipe(stream)
        .on('error', reject)
        .on('finish', resolve);
    });
  }
}
