import { UsedHash } from '../entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(UsedHash)
export class UsedHashRepository extends Repository<UsedHash> {}
