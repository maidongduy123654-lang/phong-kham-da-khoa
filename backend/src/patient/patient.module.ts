import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientController } from './patient.controller';
import { PatientService } from './patient.service';
import { Appointment, Doctor, Schedule, Specialty, Visit } from '../entities';

@Module({
  imports: [TypeOrmModule.forFeature([Specialty, Doctor, Schedule, Appointment, Visit])],
  controllers: [PatientController],
  providers: [PatientService],
})
export class PatientModule {}