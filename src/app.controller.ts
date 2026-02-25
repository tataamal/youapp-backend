import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // Default Endpoint
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // endpoint untuk cek koneksi
  @Get('health')
  health() {
    return { ok: true };
  }
}
