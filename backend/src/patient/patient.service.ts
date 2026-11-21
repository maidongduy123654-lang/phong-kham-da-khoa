import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { Appointment, Doctor, Schedule, Specialty, Visit } from '../entities';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(Specialty) private specialtyRepo: Repository<Specialty>,
    @InjectRepository(Doctor) private doctorRepo: Repository<Doctor>,
    @InjectRepository(Schedule) private scheduleRepo: Repository<Schedule>,
    @InjectRepository(Appointment) private appointmentRepo: Repository<Appointment>,
    @InjectRepository(Visit) private visitRepo: Repository<Visit>,
  ) {}

  async getSpecialties() {
    return this.specialtyRepo.find();
  }

  async getDoctorsBySpecialty(specialtyId: string) {
    return this.doctorRepo.find({ where: { specialtyId } });
  }

  async getSlots(doctorId: string, date: string) {
    return this.scheduleRepo.find({
      where: { doctorId, date: new Date(date), isBooked: false },
      order: { startTime: 'ASC' },
    });
  }

  async createAppointment(patientId: string, dto: CreateAppointmentDto) {

    const schedule = await this.scheduleRepo.findOne({ where: { id: dto.slotId } });
    if (!schedule || schedule.isBooked) throw new BadRequestException('Slot không khả dụng');

    const qrCode = `APT-${randomUUID().slice(0, 8).toUpperCase()}`;
    const appointment = this.appointmentRepo.create({
      id: randomUUID().replace(/-/g, '').slice(0, 26),
      patientId: patientId, // Dùng trực tiếp biến truyền vào
      doctorId: dto.doctorId,
      scheduleId: dto.slotId,
      qrCode,
      reason: dto.reason,
    });

    schedule.isBooked = true;
    await this.scheduleRepo.save(schedule);
    await this.appointmentRepo.save(appointment);

    return appointment;
  }

  async checkin(qrCode: string) {
    const appointment = await this.appointmentRepo.findOne({ where: { qrCode } });
    if (!appointment) throw new NotFoundException('QR không hợp lệ');
    if (appointment.status !== 'BOOKED') throw new BadRequestException('Lịch hẹn không hợp lệ');

    appointment.status = 'CHECKED_IN';
    await this.appointmentRepo.save(appointment);

    const visit = this.visitRepo.create({
      id: randomUUID().replace(/-/g, '').slice(0, 26),
      appointmentId: appointment.id,
      patientId: appointment.patientId,
      doctorId: appointment.doctorId,
      status: 'CHECKED_IN',
      checkedInAt: new Date(),
    }as any);
    await this.visitRepo.save(visit);

    return { message: 'Check-in thành công', visit };
  }

  async getMyAppointments(patientId: string) {
    return this.appointmentRepo.find({
      where: { patientId },
      relations: ['doctor', 'schedule']as any,
      order: { createdAt: 'DESC' },
    });
  }
}