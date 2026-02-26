import {
  ArrayMaxSize,
  IsArray,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  IsUrl,
  Max,
  Min,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Gender } from '../schemas/profile.schema';

export class CreateProfileDto {
  @ApiPropertyOptional({
    example: 'Abdul Munir',
    description: 'Full name of the user',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/profile.jpg',
    description: 'URL of the profile picture',
  })
  @IsOptional()
  @IsString()
  profilePicture?: string;

  @ApiPropertyOptional({
    enum: Gender,
    example: Gender.MALE,
    description: 'Gender of the user',
  })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiPropertyOptional({
    example: '02-12-2003',
    description: 'Birthday in DD-MM-YYYY format',
  })
  @IsOptional()
  @Matches(/^\d{2}-\d{2}-\d{4}$/, {
    message: 'birthday must be in format DD-MM-YYYY (e.g. 02-12-2003)',
  })
  birthday?: string;

  @ApiPropertyOptional({
    example: 175,
    description: 'Height in cm',
    minimum: 0,
    maximum: 300,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(300)
  height?: number;

  @ApiPropertyOptional({
    example: 70,
    description: 'Weight in kg',
    minimum: 0,
    maximum: 500,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(500)
  weight?: number;

  @ApiPropertyOptional({
    example: ['reading', 'coding'],
    description: 'List of interests',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(50)
  interests?: string[];
}
