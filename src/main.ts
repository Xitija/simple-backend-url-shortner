import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );
  const config = new DocumentBuilder()
    .setTitle('Url Shortner')
    .setDescription(`The working of a URL shortener is straightforward. In the short URL generation part, the API takes in a POST request with the original URL as a payload. A unique ID is generated that corresponds to the original URL. This ID is added to the end of the base URL, i.e., the URL of your application.
    The generated URL and the original URL are stored in the database.

    Tech Stack: Postgres, Prisma, NestJS-Fastify`)
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');

}
bootstrap();
