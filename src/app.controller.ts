import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // Default Endpoint
  @Get()
  @ApiOperation({ summary: 'Default root endpoint' })
  @ApiOkResponse({ description: 'Returns a welcome message' })
  getHello(): string {
    return this.appService.getHello();
  }

  // endpoint untuk cek koneksi
  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiOkResponse({ description: 'Returns connection status' })
  health() {
    return { ok: true };
  }
}
