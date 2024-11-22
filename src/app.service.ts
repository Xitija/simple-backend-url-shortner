import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getHealth(): string {
    return 'Server running '
  }

  getTime(): string {
    return new Date().toUTCString()
  }
}
