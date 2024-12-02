import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'
// import { Cron } from '@nestjs/schedule';
import { validateUrl } from './utils';
import { PrismaService } from './prisma.service';
import { UrlSchema, Prisma } from "@prisma/client";
import { nanoid } from 'nanoid';

@Injectable()
export class AppService {

  constructor(private readonly prisma: PrismaService, private readonly configService: ConfigService) { }

  getHello(): string {
    return 'Hello World!';
  }

  // @Cron('*/5 * * * * *')
  getHealth(): string {
    return 'Server running '
  }

  getTime(): string {
    return new Date().toUTCString()
  }

  async shorten(origUrl: string) {
    if (validateUrl(origUrl)) {
      try {
        let url = await this.urlByOrignalUrl({ origUrl });
        if (url) {
          return url;
        } else {
          const urlId = nanoid(8);
          const shortUrl = `${this.configService.get<string>('BASE')}/${urlId}`
          const saveUrl = await this.createUrl({ urlId, origUrl, shortUrl, clicks: 0 })

          return saveUrl;
        }
      } catch (error) {
        throw new InternalServerErrorException("Something went wrong")
      }

    }
  }

  async getUrl(code: Prisma.UrlSchemaWhereUniqueInput) {
    const urlByCode = await this.getUrlByCode(code);
    if (urlByCode) {
      return urlByCode;
    } else {
      throw new NotFoundException("Url not found");
    }
  }

  async createUrl(data: Prisma.UrlSchemaCreateInput): Promise<UrlSchema> {
    return this.prisma.urlSchema.create({
      data
    })
  }

  async urlByOrignalUrl(where: Prisma.UrlSchemaWhereInput): Promise<UrlSchema> {
    return this.prisma.urlSchema.findFirst({ where })
  }

  async getUrlByCode(code: Prisma.UrlSchemaWhereUniqueInput) {
    return this.prisma.urlSchema.findUnique({ where: code })
  }
}
