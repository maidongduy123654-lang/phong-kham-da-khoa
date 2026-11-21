import {
    Entity, PrimaryColumn, Column, CreateDateColumn,
    OneToOne, JoinColumn, OneToMany,
  } from 'typeorm';
  import { Visit } from './visit.entity';
  import { PrescriptionItem } from './prescription-item.entity';
  
  @Entity('prescriptions')
  export class Prescription {
    @PrimaryColumn({ length: 26 })
    id: string;
  
    @Column({ name: 'visit_id', length: 26 })
    visitId: string;
  
    @Column({ name: 'diagnosis_icd10', length: 20, nullable: true })
    diagnosisIcd10: string;
  
    @Column({ type: 'text', nullable: true })
    advice: string;
  
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
  
    @OneToOne(() => Visit, (visit) => visit.prescription)
    @JoinColumn({ name: 'visit_id' })
    visit: Visit;
  
    @OneToMany(() => PrescriptionItem, (item) => item.prescription)
    items: PrescriptionItem[];
  }