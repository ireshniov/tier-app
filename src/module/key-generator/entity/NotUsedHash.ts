import { Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'not_used_hashes' })
export class NotUsedHash {
  @PrimaryColumn({ type: 'varchar', length: 8, nullable: false })
  hash: string;
}
