import {
    Entity, PrimaryColumn, Column, CreateDateColumn, ManyToOne, JoinColumn,
  } from 'typeorm';
  import { User } from './user.entity';
  
  @Entity('audit_logs')
  export class AuditLog {
    @PrimaryColumn({ length: 26 })
    id: string;
  
    @Column({ name: 'user_id', length: 26, nullable: true })
    userId: string;
  
    @Column({ length: 100 })
    action: string;
  
    @Column({ length: 50, nullable: true })
    entity: string;
  
    @Column({ name: 'entity_id', length: 26, nullable: true })
    entityId: string;
  
    @Column({ type: 'json', nullable: true })
    metadata: any;
  
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
  
    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: 'user_id' })
    user: User;
  }