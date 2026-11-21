import {
    Entity, PrimaryColumn, Column, CreateDateColumn, ManyToOne, JoinColumn,
  } from 'typeorm';
  import { Doctor } from './doctor.entity';
  
  @Entity('schedules')
  export class Schedule {
    @PrimaryColumn({ length: 26 })
    id: string;
  
    @Column({ name: 'doctor_id', length: 26 })
    doctorId: string;
  
    @Column({ type: 'date' })
    date: Date;
  
    @Column({ name: 'start_time', type: 'time' })
    startTime: string;
  
    @Column({ name: 'end_time', type: 'time' })
    endTime: string;
  
    @Column({ name: 'is_booked', default: false })
    isBooked: boolean;
  
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
  
    @ManyToOne(() => Doctor, (doctor) => doctor.schedules)
    @JoinColumn({ name: 'doctor_id' })
    doctor: Doctor;
  }