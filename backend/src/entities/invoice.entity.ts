import {
    Entity, PrimaryColumn, Column, CreateDateColumn, ManyToOne, JoinColumn,
  } from 'typeorm';
  import { Visit } from './visit.entity';
  
  export enum InvoiceType {
    CONSULT = 'CONSULT',
    LAB = 'LAB',
    MEDICINE = 'MEDICINE',
  }
  
  export enum InvoiceStatus {
    PENDING = 'PENDING',
    PAID = 'PAID',
    CANCELLED = 'CANCELLED',
  }
  
  @Entity('invoices')
  export class Invoice {
    @PrimaryColumn({ length: 26 })
    id: string;
  
    @Column({ name: 'visit_id', length: 26 })
    visitId: string;
  
    @Column({ type: 'enum', enum: InvoiceType })
    type: InvoiceType;
  
    @Column({ type: 'decimal', precision: 12, scale: 2 })
    amount: number;
  
    @Column({ type: 'enum', enum: ['CASH', 'CARD', 'TRANSFER'], default: 'CASH' })
    method: string;
  
    @Column({ type: 'enum', enum: InvoiceStatus, default: InvoiceStatus.PENDING })
    status: InvoiceStatus;
  
    @Column({ type: 'text', nullable: true })
    note: string;
  
    @Column({ name: 'paid_at', type: 'timestamp', nullable: true })
    paidAt: Date;
  
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
  
    @ManyToOne(() => Visit, (visit) => visit.invoices)
    @JoinColumn({ name: 'visit_id' })
    visit: Visit;
  }