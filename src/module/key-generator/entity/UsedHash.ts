import { Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'used_hashes' })
export class UsedHash {
  @PrimaryColumn({ type: 'varchar', length: 8, nullable: false })
  hash: string;
}
