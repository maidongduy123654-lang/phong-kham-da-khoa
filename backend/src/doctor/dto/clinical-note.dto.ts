import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsObject } from 'class-validator';

export class ClinicalNoteDto {
  @ApiProperty({ example: 'Đau đầu, chóng mặt' })
  @IsString()
  @IsNotEmpty()
  symptoms: string;

  @ApiProperty({ example: { mach: 80, huyetAp: '120/80', nhietDo: 37 }, required: false })
  @IsObject()
  @IsOptional()
  vitals?: any;

  @ApiProperty({ example: 'R51', required: false })
  @IsString()
  @IsOptional()
  diagnosisIcd10?: string;

  @ApiProperty({ example: 'Uống nhiều nước', required: false })
  @IsString()
  @IsOptional()
  advice?: string;
}