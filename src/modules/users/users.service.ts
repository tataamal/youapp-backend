import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  findByUsername(username: string) {
    return this.userModel.findOne({ username: username.toLowerCase() }).exec();
  }

  findByEmail(email: string) {
    return this.userModel.findOne({ email: email }).exec();
  }

  create(data: { username: string; email: string; passwordHash: string }) {
    return this.userModel.create({
      username: data.username.toLowerCase(),
      email: data.email,
      passwordHash: data.passwordHash,
    });
  }
}
