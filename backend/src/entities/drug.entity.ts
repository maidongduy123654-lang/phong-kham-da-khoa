import { Entity, PrimaryColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { PrescriptionItem } from './prescription-item.entity';

@Entity('drugs')
export class Drug {
  @PrimaryColumn({ length: 26 })
  id: string;

  @Column({ length: 200 })
  name: string;

  @Column({ length: 50, nullable: true })
  unit: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  price: number;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @Column({ type: 'json', nullable: true })
  contraindications: string[];

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => PrescriptionItem, (item) => item.drug)
  prescriptionItems: PrescriptionItem[];
}