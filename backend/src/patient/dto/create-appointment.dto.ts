import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateAppointmentDto {
  @ApiProperty({ example: '01DOCTOR0000000000000001' })
  @IsString()
  @IsNotEmpty()
  doctorId: string;

  @ApiProperty({ example: '01SCHED00000000000000001' })
  @IsString()
  @IsNotEmpty()
  slotId: string;

  @ApiProperty({ example: '2026-11-25' })
  @IsString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({ example: 'Đau đầu', required: false })
  @IsString()
  @IsOptional()
  reason?: string;
}