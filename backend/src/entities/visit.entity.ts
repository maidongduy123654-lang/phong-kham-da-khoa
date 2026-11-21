import {
    Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn,
    ManyToOne, JoinColumn, OneToOne, OneToMany,
  } from 'typeorm';
  import { Patient } from './patient.entity';
  import { Doctor } from './doctor.entity';
  import { Appointment } from './appointment.entity';
  import { QueueTicket } from './queue-ticket.entity';
  import { ClinicalNote } from './clinical-note.entity';
  import { Prescription } from './prescription.entity';
  import { LabOrder } from './lab-order.entity';
  import { Invoice } from './invoice.entity';
  
  export enum VisitStatus {
    BOOKED = 'BOOKED',
    CHECKED_IN = 'CHECKED_IN',
    WAITING_DOCTOR = 'WAITING_DOCTOR',
    IN_CONSULTATION = 'IN_CONSULTATION',
    PENDING_LAB = 'PENDING_LAB',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
    NO_SHOW = 'NO_SHOW',
  }
  
  @Entity('visits')
  export class Visit {
    @PrimaryColumn({ length: 26 })
    id: string;
  
    @Column({ name: 'appointment_id', length: 26, nullable: true })
    appointmentId: string;
  
    @Column({ name: 'patient_id', length: 26 })
    patientId: string;
  
    @Column({ name: 'doctor_id', length: 26 })
    doctorId: string;
  
    @Column({ type: 'enum', enum: VisitStatus, default: VisitStatus.BOOKED })
    status: VisitStatus;
  
    @Column({ name: 'queue_number', type: 'int', nullable: true })
    queueNumber: number;
  
    @Column({ name: 'checked_in_at', type: 'timestamp', nullable: true })
    checkedInAt: Date;
  
    @Column({ name: 'started_at', type: 'timestamp', nullable: true })
    startedAt: Date;
  
    @Column({ name: 'completed_at', type: 'timestamp', nullable: true })
    completedAt: Date;
  
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
  
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
  
    @OneToOne(() => Appointment, (appointment) => appointment.visit, { nullable: true })
    @JoinColumn({ name: 'appointment_id' })
    appointment: Appointment;
  
    @ManyToOne(() => Patient, (patient) => patient.visits)
    @JoinColumn({ name: 'patient_id' })
    patient: Patient;
  
    @ManyToOne(() => Doctor, (doctor) => doctor.visits)
    @JoinColumn({ name: 'doctor_id' })
    doctor: Doctor;
  
    @OneToMany(() => QueueTicket, (ticket) => ticket.visit)
    queueTickets: QueueTicket[];
  
    @OneToOne(() => ClinicalNote, (note) => note.visit)
    clinicalNote: ClinicalNote;
  
    @OneToOne(() => Prescription, (prescription) => prescription.visit)
    prescription: Prescription;
  
    @OneToMany(() => LabOrder, (labOrder) => labOrder.visit)
    labOrders: LabOrder[];
  
    @OneToMany(() => Invoice, (invoice) => invoice.visit)
    invoices: Invoice[];
  }