import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReceptionController } from './reception.controller';
import { ReceptionService } from './reception.service';
import { Appointment, Visit, Invoice, QueueTicket } from '../entities';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment, Visit, Invoice, QueueTicket])],
  controllers: [ReceptionController],
  providers: [ReceptionService],
})
export class ReceptionModule {}