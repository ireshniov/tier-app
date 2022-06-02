import {
  EventSubscriber,
  EntitySubscriberInterface,
  InsertEvent,
} from 'typeorm';
import { Url } from '../entity';

@EventSubscriber()
export class UrlEntitySubscriber implements EntitySubscriberInterface<Url> {
  listenTo(): any {
    return Url;
  }

  async beforeInsert(event: InsertEvent<Url>): Promise<void> {
    event.entity.createdAt = new Date();
  }
}
