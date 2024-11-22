import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiBody } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("/health")
  getHealth(): string {
    return this.appService.getHealth();
  }

  @ApiBody({})
  @Post("/echo")
  echoBody(@Body() body: any): string {
    return body;
  }

  @Get("/time")
  getTime(): string {
    return this.appService.getTime()
  }
  
}
