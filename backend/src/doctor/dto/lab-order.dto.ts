import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class LabOrderDto {
  @ApiProperty({ example: [{ code: 'XN-MAU', name: 'Xét nghiệm máu' }] })
  @IsArray()
  @IsNotEmpty()
  items: { code: string; name: string }[];

  @ApiProperty({ example: 'Nghi ngờ thiếu máu', required: false })
  @IsString()
  @IsOptional()
  note?: string;
}