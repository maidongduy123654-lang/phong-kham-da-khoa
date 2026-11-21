import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorController } from './doctor.controller';
import { DoctorService } from './doctor.service';
import { Visit, QueueTicket, ClinicalNote, LabOrder, Prescription, PrescriptionItem } from '../entities';

@Module({
  imports: [TypeOrmModule.forFeature([Visit, QueueTicket, ClinicalNote, LabOrder, Prescription, PrescriptionItem])],
  controllers: [DoctorController],
  providers: [DoctorService],
})
export class DoctorModule {}