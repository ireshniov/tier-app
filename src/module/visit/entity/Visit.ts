import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'visits' })
@Index('IDX_hash', ['hash'])
@Index('IDX_destination', ['destination'])
export class Visit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  hash: string;

  @Column()
  destination: string;

  @Column({
    type: 'timestamp with time zone',
    nullable: false,
    update: false,
  })
  date: Date;
}
