import {
    Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn,
    OneToOne, JoinColumn,
  } from 'typeorm';
  import { Visit } from './visit.entity';
  
  @Entity('clinical_notes')
  export class ClinicalNote {
    @PrimaryColumn({ length: 26 })
    id: string;
  
    @Column({ name: 'visit_id', length: 26, unique: true })
    visitId: string;
  
    @Column({ type: 'text', nullable: true })
    symptoms: string;
  
    @Column({ type: 'json', nullable: true })
    vitals: { mach?: number; huyetAp?: string; nhietDo?: number };
  
    @Column({ name: 'diagnosis_icd10', length: 20, nullable: true })
    diagnosisIcd10: string;
  
    @Column({ type: 'text', nullable: true })
    advice: string;
  
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
  
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
  
    @OneToOne(() => Visit, (visit) => visit.clinicalNote)
    @JoinColumn({ name: 'visit_id' })
    visit: Visit;
  }