import { Body, Controller, Get, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiBody } from '@nestjs/swagger';
import { UrlShortnerDto } from './urlShortner.dto';

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

  @Post("/short")
  @ApiBody({ type: UrlShortnerDto })
  @UsePipes(new ValidationPipe({ transform: true }))
  shorten(@Body() body: UrlShortnerDto) {
    return this.appService.shorten(body.origUrl)
  }

  @Get(":code")
  getUrlByCode(@Param("code") code: string) {
    return this.appService.getUrl({ urlId: code });
  }
}
