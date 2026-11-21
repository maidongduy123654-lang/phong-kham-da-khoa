import { BadRequestException, Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PatientService } from './patient.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Patient')
@Controller('patient')
export class PatientController {
  constructor(private patientService: PatientService) {}

  @Get('specialties')
  getSpecialties() {
    return this.patientService.getSpecialties();
  }

  @Get('specialties/:id/doctors')
  getDoctors(@Param('id') id: string) {
    return this.patientService.getDoctorsBySpecialty(id);
  }

  @Get('doctors/:id/slots')
  getSlots(@Param('id') id: string, @Query('date') date: string) {
    return this.patientService.getSlots(id, date);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('appointments')
  createAppointment(@CurrentUser() user: any, @Body() dto: CreateAppointmentDto) {
    // Lấy patientId tự động từ token
    if (!user.patientId) {
      throw new BadRequestException('Chỉ bệnh nhân mới có thể đặt lịch');
    }
    return this.patientService.createAppointment(user.patientId, dto);
  }

  @Post('checkin')
  checkin(@Body('qrCode') qrCode: string) {
    return this.patientService.checkin(qrCode);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me/appointments')
  getMyAppointments(@CurrentUser('id') patientId: string) {
    return this.patientService.getMyAppointments(patientId);
  }
}