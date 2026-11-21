import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CheckinDto {
  @ApiProperty({ example: 'APT-1A2B3C4D' })
  @IsString()
  @IsNotEmpty()
  qrCode: string;
}