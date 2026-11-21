import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { Visit, QueueTicket, QueueStatus, ClinicalNote, LabOrder, LabOrderStatus, Prescription, PrescriptionItem, VisitStatus } from '../entities';

@Injectable()
export class DoctorService {
  constructor(
    @InjectRepository(Visit) private visitRepo: Repository<Visit>,
    @InjectRepository(QueueTicket) private queueRepo: Repository<QueueTicket>,
    @InjectRepository(ClinicalNote) private clinicalRepo: Repository<ClinicalNote>,
    @InjectRepository(LabOrder) private labRepo: Repository<LabOrder>,
    @InjectRepository(Prescription) private presRepo: Repository<Prescription>,
    @InjectRepository(PrescriptionItem) private presItemRepo: Repository<PrescriptionItem>,
  ) {}

  async getQueue(doctorId: string) {
    return this.queueRepo.find({
      where: { status: QueueStatus.WAITING, visit: { doctorId } as any },
      relations: ['visit', 'visit.patient'] as any,
      order: { number: 'ASC' },
    });
  }

  async callPatient(ticketId: string) {
    const ticket = await this.queueRepo.findOne({ where: { id: ticketId }, relations: ['visit'] as any });
    if (!ticket) throw new NotFoundException('Không tìm thấy vé');
    
    ticket.status = QueueStatus.CALLED;
    ticket.calledAt = new Date();
    await this.queueRepo.save(ticket);

    const visit = ticket.visit;
    visit.status = VisitStatus.IN_CONSULTATION;
    visit.startedAt = new Date();
    await this.visitRepo.save(visit);

    return { message: 'Đã gọi bệnh nhân', ticket };
  }

  async saveClinicalNote(visitId: string, dto: any) {
    let note = await this.clinicalRepo.findOne({ where: { visitId } });
    if (!note) {
      note = this.clinicalRepo.create({ id: randomUUID().replace(/-/g, '').slice(0, 26), visitId });
    }
    Object.assign(note, dto);
    return this.clinicalRepo.save(note);
  }

  async createLabOrder(visitId: string, dto: any) {
    const labOrder = this.labRepo.create({
      id: randomUUID().replace(/-/g, '').slice(0, 26),
      visitId,
      items: dto.items,
      note: dto.note,
      status: LabOrderStatus.PENDING,
    } as any);
    await this.labRepo.save(labOrder);

    const visit = await this.visitRepo.findOne({ where: { id: visitId } });
    if (visit) {
      visit.status = VisitStatus.PENDING_LAB;
      await this.visitRepo.save(visit);
    }
    return labOrder;
  }

  async createPrescription(visitId: string, dto: any) {
    const pres = this.presRepo.create({
      id: randomUUID().replace(/-/g, '').slice(0, 26),
      visitId,
      diagnosisIcd10: dto.diagnosisIcd10,
      advice: dto.advice,
    } as any);
    await this.presRepo.save(pres);

    if (dto.items && dto.items.length > 0) {
        const items = dto.items.map((item: any) => {
            return this.presItemRepo.create({
              id: randomUUID().replace(/-/g, '').slice(0, 26),
              prescriptionId: pres,
              drugId: item.drugId,
              dosage: item.dosage,
              qty: item.qty,
              days: item.days,
            } as any);
          });
          
          await this.presItemRepo.save(items as any); 
        }
        return pres;
      }

  async completeVisit(visitId: string) {
    const visit = await this.visitRepo.findOne({ where: { id: visitId } });
    if (!visit) throw new NotFoundException('Không tìm thấy ca khám');

    visit.status = VisitStatus.COMPLETED;
    visit.completedAt = new Date();
    await this.visitRepo.save(visit);

    return { message: 'Đã hoàn thành ca khám', visit };
  }
}