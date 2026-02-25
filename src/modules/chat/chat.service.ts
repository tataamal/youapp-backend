import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { SendMessageDto } from './dto/send-message.dto';
import { ViewMessagesQueryDto } from './dto/view-messages.dto';
import {
  Conversation,
  ConversationDocument,
} from './schemas/conversation.schema';
import { Message, MessageDocument } from './schemas/message.schema';
import { RabbitMqService } from '../notification/rabbitmq.service';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Conversation.name)
    private convoModel: Model<ConversationDocument>,
    @InjectModel(Message.name) private msgModel: Model<MessageDocument>,
    private rabbit: RabbitMqService,
  ) {}

  private makeParticipantsHash(a: Types.ObjectId, b: Types.ObjectId) {
    const [x, y] = [a.toString(), b.toString()].sort();
    return `${x}_${y}`;
  }

  private async getOrCreateConversation(a: Types.ObjectId, b: Types.ObjectId) {
    const hash = this.makeParticipantsHash(a, b);

    const existing = await this.convoModel.findOne({ participantsHash: hash });
    if (existing) return existing;

    return this.convoModel.create({
      participants: [a, b],
      participantsHash: hash,
    });
  }

  async sendMessage(senderUserId: string, dto: SendMessageDto) {
    const senderId = new Types.ObjectId(senderUserId);

    const receiver = await this.userModel.findOne({ username: dto.toUsername });
    if (!receiver) throw new NotFoundException('Receiver not found');

    const receiverId = receiver._id as Types.ObjectId;

    const convo = await this.getOrCreateConversation(senderId, receiverId);

    const message = await this.msgModel.create({
      conversationId: convo._id,
      senderId,
      receiverId,
      text: dto.message,
    });

    await this.convoModel.updateOne(
      { _id: convo._id },
      {
        $set: {
          lastMessageAt: message.createdAt,
          lastMessagePreview: dto.message.slice(0, 50),
        },
      },
    );

    await this.rabbit.publishMessageCreated({
      messageId: message._id.toString(),
      conversationId: convo._id.toString(),
      senderId: senderId.toString(),
      receiverId: receiverId.toString(),
      text: message.text,
      createdAt: message.createdAt,
    });

    return message;
  }

  async viewMessages(currentUserId: string, query: ViewMessagesQueryDto) {
    const me = new Types.ObjectId(currentUserId);

    const other = await this.userModel.findOne({
      username: query.withUsername,
    });
    if (!other) throw new NotFoundException('User not found');

    const otherId = other._id as Types.ObjectId;
    const hash = this.makeParticipantsHash(me, otherId);

    const convo = await this.convoModel.findOne({ participantsHash: hash });
    if (!convo) return [];

    const limit = query.limit ?? 20;
    const skip = query.skip ?? 0;

    return this.msgModel
      .find({ conversationId: convo._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
  }
}
