import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller()
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  // POST /api/createProfile
  @UseGuards(JwtAuthGuard)
  @Post('createProfile')
  createProfile(@Req() req: any, @Body() dto: CreateProfileDto) {
    return this.profileService.createProfile(req.user.sub, dto);
  }

  // GET /api/getProfile
  @UseGuards(JwtAuthGuard)
  @Get('getProfile')
  getProfile(@Req() req: any) {
    return this.profileService.getProfile(req.user.sub);
  }

  // PUT /api/updateProfile
  @UseGuards(JwtAuthGuard)
  @Put('updateProfile')
  updateProfile(@Req() req: any, @Body() dto: UpdateProfileDto) {
    return this.profileService.updateProfile(req.user.sub, dto);
  }
}
