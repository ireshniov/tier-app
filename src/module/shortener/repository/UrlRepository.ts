import { EntityRepository, Repository } from 'typeorm';
import { Url } from '../entity';

@EntityRepository(Url)
export class UrlRepository extends Repository<Url> {
  async findDestinationByHash(hash: string): Promise<string | undefined> {
    return (await this.findOne(hash))?.destination;
  }

  async findOneByDestination(destination: string): Promise<Url | undefined> {
    return await this.findOne({ where: { destination } });
  }
}
