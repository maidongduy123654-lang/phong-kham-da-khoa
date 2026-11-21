import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ReceptionService } from './reception.service';
import { CheckinDto } from './dto/checkin.dto';
import { PaymentDto } from './dto/payment.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@ApiTags('Reception')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.RECEPTIONIST, Role.ADMIN)
@Controller('reception')
export class ReceptionController {
  constructor(private receptionService: ReceptionService) {}

  @Post('checkin/scan')
  scanCheckin(@Body() dto: CheckinDto) {
    return this.receptionService.scanCheckin(dto.qrCode);
  }

  @Post('visits/:id/pay-and-enqueue')
  payAndEnqueue(@Param('id') id: string, @Body() dto: PaymentDto) {
    return this.receptionService.payAndEnqueue(id, dto);
  }

  @Get('queues')
  getQueue() {
    return this.receptionService.getQueue();
  }
}