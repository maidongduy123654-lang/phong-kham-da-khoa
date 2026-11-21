import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import {
  User, Patient, Doctor, Specialty, Schedule, Appointment,
  Visit, QueueTicket, ClinicalNote, Drug, Prescription,
  PrescriptionItem, LabOrder, Invoice, AuditLog,
} from './entities';
import { PatientModule } from './patient/patient.module';
import { ReceptionModule } from './reception/reception.module';
import { AdminModule } from './admin/admin.module';
import { DoctorModule } from './doctor/doctor.module';




@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 3306),
        username: config.get('DB_USER'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_NAME'),
        entities: [
          User, Patient, Doctor, Specialty, Schedule, Appointment,
          Visit, QueueTicket, ClinicalNote, Drug, Prescription,
          PrescriptionItem, LabOrder, Invoice, AuditLog,
        ],
        synchronize: false,
        logging: ['error'],
      }),
    }),
    AuthModule,
    PatientModule,
    ReceptionModule,
    AdminModule,
    DoctorModule
  ],
})
export class AppModule {}