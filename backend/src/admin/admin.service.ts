import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { User, Doctor, Patient, Specialty } from '../entities';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Specialty) private specialtyRepo: Repository<Specialty>,
    private dataSource: DataSource,
  ) {}

  async createUser(dto: any) {
    const exists = await this.userRepo.findOne({ where: { username: dto.username } });
    if (exists) throw new ConflictException('Username đã tồn tại');

    const hash = await bcrypt.hash(dto.password, 10);
    const userId = randomUUID().replace(/-/g, '').slice(0, 26);

    return this.dataSource.transaction(async (manager) => {
      const user = manager.create(User, {
        id: userId,
        username: dto.username,
        passwordHash: hash,
        role: dto.role,
        isActive: true,
      } as any);
      await manager.save(user);

      // Nếu tạo Bác sĩ thì tạo thêm record trong bảng doctors
      if (dto.role === Role.DOCTOR) {
        // Lấy đại 1 chuyên khoa đầu tiên để test
        const spec = await this.specialtyRepo.findOne({ where: {} });
        const doctor = manager.create(Doctor, {
          id: randomUUID().replace(/-/g, '').slice(0, 26),
          userId: userId,
          fullName: dto.fullName,
          specialtyId: spec ? spec.id : null, 
        } as any);
        await manager.save(doctor);
      }

      return { message: 'Tạo tài khoản thành công', userId };
    });
  }

  async getSpecialties() {
    return this.specialtyRepo.find();
  }
}