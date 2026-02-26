import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ViewMessagesQueryDto {
  @ApiProperty({
    example: 'abdulmunir',
    description: 'Username of the user you are chatting with',
  })
  @IsString()
  withUsername: string;

  @ApiPropertyOptional({
    example: 20,
    description: 'Number of messages to retrieve',
    default: 20,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiPropertyOptional({
    example: 0,
    description: 'Number of messages to skip',
    default: 0,
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  skip?: number = 0;
}
