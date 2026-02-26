import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class SendMessageDto {
  @ApiProperty({
    example: 'abdulmunir',
    description: 'Target user to send a message to',
  })
  @IsString()
  @MinLength(1)
  toUsername: string;

  @ApiProperty({ example: 'Hello, how are you?' })
  @IsString()
  @MinLength(1)
  message: string;
}
