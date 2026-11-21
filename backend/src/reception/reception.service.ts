import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { Appointment, Visit, Invoice, QueueTicket, QueueType, QueueStatus, VisitStatus } from '../entities';

@Injectable()
export class ReceptionService {
  constructor(
    @InjectRepository(Appointment) private appointmentRepo: Repository<Appointment>,
    @InjectRepository(Visit) private visitRepo: Repository<Visit>,
    @InjectRepository(Invoice) private invoiceRepo: Repository<Invoice>,
    @InjectRepository(QueueTicket) private queueRepo: Repository<QueueTicket>,
  ) {}

  async scanCheckin(qrCode: string) {
    const appointment = await this.appointmentRepo.findOne({ 
      where: { qrCode }, 
      relations: ['patient', 'doctor'] as any 
    });
    
    if (!appointment) throw new NotFoundException('Không tìm thấy lịch hẹn');
    if (appointment.status === 'CHECKED_IN') throw new BadRequestException('Đã check-in rồi');

    appointment.status = 'CHECKED_IN' as any;
    await this.appointmentRepo.save(appointment);

    const visit = this.visitRepo.create({
      id: randomUUID().replace(/-/g, '').slice(0, 26),
      appointmentId: appointment.id,
      patientId: appointment.patientId,
      doctorId: appointment.doctorId,
      status: 'CHECKED_IN',
      checkedInAt: new Date(),
    } as any);
    await this.visitRepo.save(visit);

    return { message: 'Check-in thành công', visit };
  }

  async payAndEnqueue(visitId: string, dto: any) {
    const visit = await this.visitRepo.findOne({ where: { id: visitId } });
    if (!visit) throw new NotFoundException('Không tìm thấy ca khám');

    // 1. Tạo hóa đơn
    const invoice = this.invoiceRepo.create({
      id: randomUUID().replace(/-/g, '').slice(0, 26),
      visitId: visit.id,
      type: 'CONSULT',
      amount: dto.amount,
      method: dto.method,
      status: 'PAID',
      paidAt: new Date(),
      note: dto.note,
    } as any);
    await this.invoiceRepo.save(invoice);

    // 2. Đổi trạng thái visit
    visit.status = VisitStatus.WAITING_DOCTOR;
    await this.visitRepo.save(visit);

    // 3. Cấp số thứ tự (FIFO)
    const lastTicket = await this.queueRepo.findOne({
      where: { type: QueueType.DOCTOR },
      order: { number: 'DESC' },
    });
    const nextNumber = lastTicket ? lastTicket.number + 1 : 1;

    const ticket = this.queueRepo.create({
      id: randomUUID().replace(/-/g, '').slice(0, 26),
      visitId: visit.id,
      type: QueueType.DOCTOR,
      number: nextNumber,
      status: QueueStatus.WAITING,
    } as any); // <--- Đã thêm as any ở đây
    await this.queueRepo.save(ticket);

    return { message: 'Thanh toán và xếp hàng thành công', invoice, ticket };
  }

  async getQueue() {
    return this.queueRepo.find({
      where: { type: QueueType.DOCTOR, status: QueueStatus.WAITING },
      relations: ['visit', 'visit.patient'] as any,
      order: { number: 'ASC' },
    });
  }
}