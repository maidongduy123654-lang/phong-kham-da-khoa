import {
    Entity, PrimaryColumn, Column, CreateDateColumn, ManyToOne, JoinColumn,
  } from 'typeorm';
  import { Visit } from './visit.entity';
  
  export enum QueueType {
    RECEPTION = 'RECEPTION',
    DOCTOR = 'DOCTOR',
  }
  
  export enum QueueStatus {
    WAITING = 'WAITING',
    CALLED = 'CALLED',
    SERVING = 'SERVING',
    DONE = 'DONE',
    SKIPPED = 'SKIPPED',
  }
  
  @Entity('queue_tickets')
  export class QueueTicket {
    @PrimaryColumn({ length: 26 })
    id: string;
  
    @Column({ name: 'visit_id', length: 26 })
    visitId: string;
  
    @Column({ type: 'enum', enum: QueueType })
    type: QueueType;
  
    @Column({ type: 'int' })
    number: number;
  
    @Column({ type: 'enum', enum: QueueStatus, default: QueueStatus.WAITING })
    status: QueueStatus;
  
    @Column({ name: 'called_at', type: 'timestamp', nullable: true })
    calledAt: Date;
  
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
  
    @ManyToOne(() => Visit, (visit) => visit.queueTickets)
    @JoinColumn({ name: 'visit_id' })
    visit: Visit;
  }