import {
    Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn,
    OneToOne, JoinColumn, OneToMany,
  } from 'typeorm';
  import { User } from './user.entity';
  import { Appointment } from './appointment.entity';
  import { Visit } from './visit.entity';
  
  @Entity('patients')
  export class Patient {
    @PrimaryColumn({ length: 26 })
    id: string;
  
    @Column({ name: 'user_id', length: 26, nullable: true })
    userId: string;
  
    @Column({ name: 'full_name', length: 100 })
    fullName: string;
  
    @Column({ type: 'date', nullable: true })
    dob: Date;
  
    @Column({ type: 'enum', enum: ['MALE', 'FEMALE', 'OTHER'], nullable: true })
    gender: string;
  
    @Column({ length: 20, unique: true, nullable: true })
    phone: string;
  
    @Column({ length: 20, unique: true, nullable: true })
    cccd: string;
  
    @Column({ type: 'text', nullable: true })
    address: string;
  
    @Column({ type: 'json', nullable: true })
    allergies: string[];
  
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
  
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
  
    @OneToOne(() => User, (user) => user.patient, { nullable: true })
    @JoinColumn({ name: 'user_id' })
    user: User;
  
    @OneToMany(() => Appointment, (appointment) => appointment.patient)
    appointments: Appointment[];
  
    @OneToMany(() => Visit, (visit) => visit.patient)
    visits: Visit[];
  }