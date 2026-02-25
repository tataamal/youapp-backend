import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Profile, ProfileDocument } from './schemas/profile.schema';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

import { parseDateOnlyDMY } from './utils/date.util';
import { getHoroscope } from './utils/horoscope.util';
import { getChineseZodiac } from './utils/zodiac.util';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Profile.name) private profileModel: Model<ProfileDocument>,
  ) {}

  async createProfile(userId: string, dto: CreateProfileDto) {
    // ✅ Cegah create dua kali (karena userId unique)
    const existing = await this.profileModel.findOne({
      userId: new Types.ObjectId(userId),
    });

    if (existing) throw new ConflictException('Profile already exists');

    const payload: Partial<Profile> = {
      userId: new Types.ObjectId(userId),
      name: dto.name,
      profilePicture: dto.profilePicture,
      gender: dto.gender,
      height: dto.height,
      weight: dto.weight,
      interests: dto.interests ?? [],
    };

    if (dto.birthday) {
      const bday = parseDateOnlyDMY(dto.birthday);
      payload.birthday = bday;
      payload.horoscope = getHoroscope(bday);
      payload.zodiac = getChineseZodiac(bday);
    }

    return this.profileModel.create(payload);
  }

  // ✅ Tambahkan getProfile
  async getProfile(userId: string) {
    const profile = await this.profileModel
      .findOne({ userId: new Types.ObjectId(userId) })
      .lean();

    if (!profile) throw new NotFoundException('Profile not found');
    return profile;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const update: any = {
      ...(dto.name !== undefined ? { name: dto.name } : {}),
      ...(dto.profilePicture !== undefined
        ? { profilePicture: dto.profilePicture }
        : {}),
      ...(dto.gender !== undefined ? { gender: dto.gender } : {}),
      ...(dto.height !== undefined ? { height: dto.height } : {}),
      ...(dto.weight !== undefined ? { weight: dto.weight } : {}),
      ...(dto.interests !== undefined ? { interests: dto.interests } : {}),
    };

    if (dto.birthday) {
      const bday = parseDateOnlyDMY(dto.birthday);
      update.birthday = bday;
      update.horoscope = getHoroscope(bday);
      update.zodiac = getChineseZodiac(bday);
    }

    const res = await this.profileModel.findOneAndUpdate(
      { userId: new Types.ObjectId(userId) },
      { $set: update },
      { new: true, runValidators: true },
    );

    if (!res) throw new NotFoundException('Profile not found');
    return res;
  }
}
