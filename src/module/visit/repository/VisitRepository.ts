import { EntityRepository, Repository } from 'typeorm';
import { Visit } from '../entity';

@EntityRepository(Visit)
export class VisitRepository extends Repository<Visit> {}
