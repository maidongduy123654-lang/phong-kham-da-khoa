import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PrescriptionDto {
  @ApiProperty({ example: [{ drugId: '01DRUG...', dosage: '500mg x 2', qty: 10, days: 5 }] })
  @IsArray()
  @IsNotEmpty()
  items: { drugId: string; dosage: string; qty: number; days?: number }[];

  @ApiProperty({ example: 'R51', required: false })
  @IsString()
  @IsOptional()
  diagnosisIcd10?: string;

  @ApiProperty({ example: 'Uống nhiều nước', required: false })
  @IsString()
  @IsOptional()
  advice?: string;
}