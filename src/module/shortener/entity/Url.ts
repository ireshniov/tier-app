import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryColumn,
} from 'typeorm';

@Entity({ name: 'urls' })
@Index('UX_destination', ['destination'], { unique: true })
export class Url {
  @PrimaryColumn({ type: 'varchar', length: 8, nullable: false })
  hash: string;

  @Column()
  destination: string;

  @CreateDateColumn({
    type: 'timestamp with time zone',
    nullable: false,
    update: false,
  })
  createdAt: Date;
}
