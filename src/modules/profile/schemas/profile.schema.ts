import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ProfileDocument = HydratedDocument<Profile>;

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}

@Schema({ timestamps: true })
export class Profile {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true,
  })
  userId: Types.ObjectId;

  @Prop({ trim: true })
  name?: string;

  // simpan url/path file (jpg/png)
  @Prop({ trim: true })
  profilePicture?: string;

  @Prop({ enum: Gender })
  gender?: Gender;

  @Prop()
  birthday?: Date;

  @Prop()
  horoscope?: string;

  @Prop()
  zodiac?: string;

  @Prop({ type: Number, min: 0 })
  height?: number;

  @Prop({ type: Number, min: 0 })
  weight?: number;

  @Prop({ type: [String], default: [] })
  interests?: string[];
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
