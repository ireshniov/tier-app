import { Injectable } from '@nestjs/common';
import { VisitRepository } from '../repository';

export interface IVisitCreate {
  hash: string;
  destination;
  date: Date;
}

@Injectable()
export class VisitService {
  constructor(private readonly visitRepository: VisitRepository) {}

  async create({ hash, destination, date }: IVisitCreate): Promise<void> {
    await this.visitRepository.save({ hash, destination, date });
  }
}
