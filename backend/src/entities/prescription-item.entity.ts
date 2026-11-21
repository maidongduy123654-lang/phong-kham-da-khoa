import {
    Entity, PrimaryColumn, Column, ManyToOne, JoinColumn,
  } from 'typeorm';
  import { Prescription } from './prescription.entity';
  import { Drug } from './drug.entity';
  
  @Entity('prescription_items')
  export class PrescriptionItem {
    @PrimaryColumn({ length: 26 })
    id: string;
  
    @Column({ name: 'prescription_id', length: 26 })
    prescriptionId: string;
  
    @Column({ name: 'drug_id', length: 26 })
    drugId: string;
  
    @Column({ length: 100, nullable: true })
    dosage: string;
  
    @Column({ type: 'int' })
    qty: number;
  
    @Column({ type: 'int', nullable: true })
    days: number;
  
    @ManyToOne(() => Prescription, (prescription) => prescription.items)
    @JoinColumn({ name: 'prescription_id' })
    prescription: Prescription;
  
    @ManyToOne(() => Drug, (drug) => drug.prescriptionItems)
    @JoinColumn({ name: 'drug_id' })
    drug: Drug;
  }