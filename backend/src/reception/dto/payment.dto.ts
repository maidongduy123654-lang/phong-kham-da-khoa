import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class PaymentDto {
  @ApiProperty({ example: 150000 })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({ example: 'CASH', enum: ['CASH', 'CARD', 'TRANSFER'] })
  @IsString()
  @IsNotEmpty()
  method: string;

  @ApiProperty({ example: 'Thu phí khám', required: false })
  @IsString()
  @IsOptional()
  note?: string;
}