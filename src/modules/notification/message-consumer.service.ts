import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { RabbitMqService } from './rabbitmq.service';
import { NotificationsGateway } from './notifications.gateway';
import {
  Message,
  MessageDocument,
  MessageStatus,
} from '../chat/schemas/message.schema';

@Injectable()
export class MessageConsumerService implements OnModuleInit {
  constructor(
    private rabbit: RabbitMqService,
    private gateway: NotificationsGateway,
    @InjectModel(Message.name) private msgModel: Model<MessageDocument>,
  ) {}

  async onModuleInit() {
    await this.rabbit.consumeMessageCreated(async (payload) => {
      const receiverOnline = this.gateway.isUserOnline(payload.receiverId);

      this.gateway.notifyUser(payload.receiverId, 'message.received', payload);

      if (receiverOnline) {
        await this.msgModel.updateOne(
          { _id: new Types.ObjectId(payload.messageId) },
          { $set: { status: MessageStatus.DELIVERED } },
        );

        this.gateway.notifyUser(payload.senderId, 'message.delivered', {
          messageId: payload.messageId,
          receiverId: payload.receiverId,
          status: MessageStatus.DELIVERED,
        });
      }
    });
  }
}
