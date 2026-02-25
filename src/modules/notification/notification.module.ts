import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from '../auth/auth.module';
import { RabbitMqService } from './rabbitmq.service';
import { MessageConsumerService } from './message-consumer.service';
import { NotificationsGateway } from './notifications.gateway';

import { Message, MessageSchema } from '../chat/schemas/message.schema';

@Module({
  imports: [
    ConfigModule,
    AuthModule,
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
  ],
  providers: [RabbitMqService, MessageConsumerService, NotificationsGateway],
  exports: [RabbitMqService, NotificationsGateway],
})
export class NotificationModule {}
