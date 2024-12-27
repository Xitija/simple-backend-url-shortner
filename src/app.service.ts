import { Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'
// import { Cron } from '@nestjs/schedule';
import { validateUrl } from './utils';
import { PrismaService } from './prisma.service';
import { UrlSchema, Prisma } from "@prisma/client";
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { nanoid } from 'nanoid';

@Injectable()
export class AppService {

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache, private readonly prisma: PrismaService, private readonly configService: ConfigService) { }

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
    const cacheKey = `url:${code.urlId}`;
    // get from cache
    let urlByCode : UrlSchema = await this.cacheManager.get(cacheKey);

    // console.log('urlByCode', urlByCode, "cache");
    // if not in cache
    if (!urlByCode) {
      // get from database
      urlByCode = await this.getUrlByCode(code);
      // console.log('urlByCode', urlByCode, "db");
      if (!urlByCode) {
        throw new NotFoundException("Url not found");
      }
    }

    // Update click count asynchronously
    this.updateUrlClickCount({ where: { urlId: urlByCode.urlId }, data: { clicks: (urlByCode.clicks + 1) } })
      .then(() => {
        // console.log('Click count updated cache');
        urlByCode.clicks += 1;
        return this.cacheManager.set(cacheKey, urlByCode, 100000); // 100000 ms = 100 seconds
      })
      .catch(err => {
        console.error('Failed to update click count or cache', err);
      });

      return { ...urlByCode, clicks: urlByCode.clicks + 1 };
  }

  async createUrl(data: Prisma.UrlSchemaCreateInput): Promise<UrlSchema> {
    return this.prisma.urlSchema.create({
      data
    })
  }

  async urlByOrignalUrl(where: Prisma.UrlSchemaWhereInput): Promise<UrlSchema> {
    return this.prisma.urlSchema.findFirst({ where })
  }

  async getUrlByCode(code: Prisma.UrlSchemaWhereUniqueInput): Promise<UrlSchema> {
    return this.prisma.urlSchema.findUnique({ where: code })
  }

  async updateUrlClickCount(params: {
    where: Prisma.UrlSchemaWhereUniqueInput,
    data: Prisma.UrlSchemaUpdateInput
  }) {
    const { where, data } = params;
    return this.prisma.urlSchema.update({
      data,
      where
    })
  }
}
