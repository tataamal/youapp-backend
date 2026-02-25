import { IsString, MinLength } from 'class-validator';

export class SendMessageDto {
  @IsString()
  @MinLength(1)
  toUsername: string;

  @IsString()
  @MinLength(1)
  message: string;
}
