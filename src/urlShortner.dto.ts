import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UrlShortnerDto {

  @ApiProperty()
  @IsNotEmpty()
  origUrl: string;
}