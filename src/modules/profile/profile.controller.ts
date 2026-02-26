import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Profile')
@ApiBearerAuth()
@Controller()
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  // POST /api/createProfile
  @UseGuards(JwtAuthGuard)
  @Post('createProfile')
  @ApiOperation({ summary: 'Create a user profile' })
  @ApiBody({ type: CreateProfileDto })
  @ApiOkResponse({ description: 'Profile created successfully' })
  createProfile(@Req() req: any, @Body() dto: CreateProfileDto) {
    return this.profileService.createProfile(req.user.sub, dto);
  }

  // GET /api/getProfile
  @UseGuards(JwtAuthGuard)
  @Get('getProfile')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiOkResponse({ description: 'Returns the user profile' })
  getProfile(@Req() req: any) {
    return this.profileService.getProfile(req.user.sub);
  }

  // PUT /api/updateProfile
  @UseGuards(JwtAuthGuard)
  @Put('updateProfile')
  @ApiOperation({ summary: 'Update user profile' })
  @ApiBody({ type: UpdateProfileDto })
  @ApiOkResponse({ description: 'Profile updated successfully' })
  updateProfile(@Req() req: any, @Body() dto: UpdateProfileDto) {
    return this.profileService.updateProfile(req.user.sub, dto);
  }
}
