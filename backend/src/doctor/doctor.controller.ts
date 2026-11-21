import { Body, Controller, Get, Param, Post, UseGuards, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DoctorService } from './doctor.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { ClinicalNoteDto } from './dto/clinical-note.dto';
import { LabOrderDto } from './dto/lab-order.dto';
import { PrescriptionDto } from './dto/prescription.dto';

@ApiTags('Doctor')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.DOCTOR, Role.ADMIN)
@Controller('doctor')
export class DoctorController {
  constructor(private doctorService: DoctorService) {}

  @Get('queue')
  getQueue(@Req() req: any) {
    // Tạm thời lấy doctorId từ user id (vì DB hiện tại userId = doctorId hoặc bạn cần query bảng doctor)
    const doctorId = req.user.id; 
    return this.doctorService.getQueue(doctorId);
  }

  @Post('queue/:id/call')
  callPatient(@Param('id') ticketId: string) {
    return this.doctorService.callPatient(ticketId);
  }

  @Post('visits/:id/clinical-note')
  saveClinicalNote(@Param('id') visitId: string, @Body() dto: ClinicalNoteDto) {
    return this.doctorService.saveClinicalNote(visitId, dto);
  }

  @Post('visits/:id/lab-orders')
  createLabOrder(@Param('id') visitId: string, @Body() dto: LabOrderDto) {
    return this.doctorService.createLabOrder(visitId, dto);
  }

  @Post('visits/:id/prescription')
  createPrescription(@Param('id') visitId: string, @Body() dto: PrescriptionDto) {
    return this.doctorService.createPrescription(visitId, dto);
  }

  @Post('visits/:id/complete')
  completeVisit(@Param('id') visitId: string) {
    return this.doctorService.completeVisit(visitId);
  }
}