import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send-message.dto';
import { ViewMessagesQueryDto } from './dto/view-messages.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller()
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(JwtAuthGuard)
  @Post('sendMessage')
  sendMessage(@Req() req: any, @Body() dto: SendMessageDto) {
    return this.chatService.sendMessage(req.user.sub, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('viewMessages')
  viewMessages(@Req() req: any, @Query() query: ViewMessagesQueryDto) {
    return this.chatService.viewMessages(req.user.sub, query);
  }
}
