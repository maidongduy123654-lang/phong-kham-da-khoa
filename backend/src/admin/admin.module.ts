import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { User, Doctor, Specialty } from '../entities';

@Module({
  imports: [TypeOrmModule.forFeature([User, Doctor, Specialty])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}