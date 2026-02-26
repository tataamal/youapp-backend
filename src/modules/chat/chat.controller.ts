import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send-message.dto';
import { ViewMessagesQueryDto } from './dto/view-messages.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Chat')
@ApiBearerAuth()
@Controller()
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(JwtAuthGuard)
  @Post('sendMessage')
  @ApiOperation({ summary: 'Send a message to a user' })
  @ApiBody({ type: SendMessageDto })
  @ApiOkResponse({ description: 'Message sent successfully' })
  sendMessage(@Req() req: any, @Body() dto: SendMessageDto) {
    return this.chatService.sendMessage(req.user.sub, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('viewMessages')
  @ApiOperation({ summary: 'View messages with a user' })
  @ApiOkResponse({ description: 'List of messages with the user' })
  viewMessages(@Req() req: any, @Query() query: ViewMessagesQueryDto) {
    return this.chatService.viewMessages(req.user.sub, query);
  }
}
