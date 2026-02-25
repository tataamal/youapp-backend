import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ConversationDocument = HydratedDocument<Conversation>;

@Schema({ timestamps: true })
export class Conversation {
  @Prop({ type: [Types.ObjectId], required: true, index: true })
  participants: Types.ObjectId[];

  @Prop({ required: true, unique: true, index: true })
  participantsHash: string;

  @Prop({ type: Date })
  lastMessageAt?: Date;

  @Prop()
  lastMessagePreview?: string;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
