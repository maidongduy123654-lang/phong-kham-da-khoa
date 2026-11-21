import {
    Entity, PrimaryColumn, Column, CreateDateColumn,
    OneToOne, JoinColumn, ManyToOne, OneToMany,
  } from 'typeorm';
  import { User } from './user.entity';
  import { Specialty } from './specialty.entity';
  import { Schedule } from './schedule.entity';
  import { Appointment } from './appointment.entity';
  import { Visit } from './visit.entity';
  
  @Entity('doctors')
  export class Doctor {
    @PrimaryColumn({ length: 26 })
    id: string;
  
    @Column({ name: 'user_id', length: 26, unique: true })
    userId: string;
  
    @Column({ name: 'full_name', length: 100 })
    fullName: string;
  
    @Column({ name: 'specialty_id', length: 26 })
    specialtyId: string;
  
    @Column({ name: 'room_no', length: 20, nullable: true })
    roomNo: string;
  
    @Column({ type: 'text', nullable: true })
    bio: string;
  
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
  
    @OneToOne(() => User, (user) => user.doctor)
    @JoinColumn({ name: 'user_id' })
    user: User;
  
    @ManyToOne(() => Specialty, (specialty) => specialty.doctors)
    @JoinColumn({ name: 'specialty_id' })
    specialty: Specialty;
  
    @OneToMany(() => Schedule, (schedule) => schedule.doctor)
    schedules: Schedule[];
  
    @OneToMany(() => Appointment, (appointment) => appointment.doctor)
    appointments: Appointment[];
  
    @OneToMany(() => Visit, (visit) => visit.doctor)
    visits: Visit[];
  }