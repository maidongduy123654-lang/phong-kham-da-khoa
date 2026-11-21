import {
    Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne,
  } from 'typeorm';
  import { Role } from '../common/enums/role.enum';
  import { Patient } from './patient.entity';
  import { Doctor } from './doctor.entity';
  
  @Entity('users')
  export class User {
    @PrimaryColumn({ length: 26 })
    id: string;
  
    @Column({ unique: true, length: 50 })
    username: string;
  
    @Column({ name: 'password_hash', length: 255 })
    passwordHash: string;
  
    @Column({ type: 'enum', enum: Role })
    role: Role;
  
    @Column({ name: 'is_active', default: true })
    isActive: boolean;
  
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
  
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
  
    @OneToOne(() => Patient, (patient) => patient.user)
    patient: Patient;
  
    @OneToOne(() => Doctor, (doctor) => doctor.user)
    doctor: Doctor;
  }