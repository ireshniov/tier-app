import { NotUsedHash } from '../entity';
import { EntityRepository, Repository } from 'typeorm';
import { IHash } from '../interface';

@EntityRepository(NotUsedHash)
export class NotUsedHashRepository extends Repository<NotUsedHash> {
  static getMovedToUsedSQL(): string {
    return 'WITH moved_hashes AS (DELETE FROM not_used_hashes WHERE hash IN (SELECT hash FROM not_used_hashes LIMIT $1) RETURNING *) INSERT INTO used_hashes (SELECT * FROM moved_hashes) RETURNING *';
  }

  async getMovedToUsed(limit: number): Promise<IHash[]> {
    return await this.query(NotUsedHashRepository.getMovedToUsedSQL(), [limit]);
  }

  async getOneHashMovedToUsed(): Promise<string> {
    return (await this.getMovedToUsed(1))[0].hash;
  }
}
