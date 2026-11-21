import {
    Entity, PrimaryColumn, Column, CreateDateColumn, ManyToOne, JoinColumn,
  } from 'typeorm';
  import { Visit } from './visit.entity';
  
  export enum LabOrderStatus {
    PENDING = 'PENDING',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
  }
  
  @Entity('lab_orders')
  export class LabOrder {
    @PrimaryColumn({ length: 26 })
    id: string;
  
    @Column({ name: 'visit_id', length: 26 })
    visitId: string;
  
    @Column({ type: 'json' })
    items: { code: string; name: string }[];
  
    @Column({ type: 'text', nullable: true })
    note: string;
  
    @Column({ type: 'enum', enum: LabOrderStatus, default: LabOrderStatus.PENDING })
    status: LabOrderStatus;
  
    @Column({ type: 'json', nullable: true })
    result: any;
  
    @Column({ name: 'approved_by', length: 26, nullable: true })
    approvedBy: string;
  
    @Column({ name: 'completed_at', type: 'timestamp', nullable: true })
    completedAt: Date;
  
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
  
    @ManyToOne(() => Visit, (visit) => visit.labOrders)
    @JoinColumn({ name: 'visit_id' })
    visit: Visit;
  }