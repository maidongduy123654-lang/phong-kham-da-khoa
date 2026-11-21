import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Role } from '../../common/enums/role.enum';

export class CreateUserDto {
  @ApiProperty({ example: 'doctor3' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'DOCTOR', enum: Role })
  @IsEnum(Role)
  role: Role;

  @ApiProperty({ example: 'BS. Trần Văn E' })
  @IsString()
  @IsNotEmpty()
  fullName: string;
}