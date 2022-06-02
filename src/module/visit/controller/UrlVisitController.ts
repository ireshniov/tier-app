import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { ChannelWrapper } from 'amqp-connection-manager';
import { VisitService } from '../service';
import { UrlVisitedEvent } from '../event';

@Controller()
export class UrlVisitController {
  constructor(private readonly visitService: VisitService) {}

  @EventPattern(UrlVisitedEvent.name)
  async create(
    @Payload() event: UrlVisitedEvent,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    await this.visitService.create(event);

    const channel: ChannelWrapper = context.getChannelRef();
    const originalMsg: Record<string, any> = context.getMessage();

    channel.ack(originalMsg);
  }
}
