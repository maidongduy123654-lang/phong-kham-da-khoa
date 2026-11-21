import {
    Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn,
    ManyToOne, JoinColumn, OneToOne,
  } from 'typeorm';
  import { Patient } from './patient.entity';
  import { Doctor } from './doctor.entity';
  import { Schedule } from './schedule.entity';
  import { Visit } from './visit.entity';
  
  @Entity('appointments')
  export class Appointment {
    @PrimaryColumn({ length: 26 })
    id: string;
  
    @Column({ name: 'patient_id', length: 26 })
    patientId: string;
  
    @Column({ name: 'doctor_id', length: 26 })
    doctorId: string;
  
    @Column({ name: 'schedule_id', length: 26 })
    scheduleId: string;
  
    @Column({ name: 'qr_code', length: 100, unique: true })
    qrCode: string;
  
    @Column({
      type: 'enum',
      enum: ['BOOKED', 'CHECKED_IN', 'CANCELLED', 'NO_SHOW'],
      default: 'BOOKED',
    })
    status: string;
  
    @Column({ type: 'text', nullable: true })
    reason: string;
  
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
  
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
  
    @ManyToOne(() => Patient, (patient) => patient.appointments)
    @JoinColumn({ name: 'patient_id' })
    patient: Patient;
  
    @ManyToOne(() => Doctor, (doctor) => doctor.appointments)
    @JoinColumn({ name: 'doctor_id' })
    doctor: Doctor;
  
    @ManyToOne(() => Schedule)
    @JoinColumn({ name: 'schedule_id' })
    schedule: Schedule;
  
    @OneToOne(() => Visit, (visit) => visit.appointment)
    visit: Visit;
  }