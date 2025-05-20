import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';

import { ConcertService } from './concert.service';
import { CreateConcertDto } from './dto/concert.dto';

@Controller('admin/concert')
export class AdminConcertController {
  constructor(private readonly concertService: ConcertService) {}

  @Post()
  create(@Body() createConcertDto: CreateConcertDto) {
    return this.concertService.createConcert(createConcertDto);
  }

  @Get()
  findAll() {
    return this.concertService.findAllAdminConcerts();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.concertService.removeConcert(+id);
  }

  @Get('/reservation/history')
  findAllHistory() {
    return this.concertService.findAllReservationHistory();
  }

  @Get('/dashboard')
  getDashboard() {
    return this.concertService.getAllDashboardData();
  }
}

@Controller('user/concert')
export class UserConcertController {
  constructor(private readonly concertService: ConcertService) {}

  @Get()
  findAll() {
    return this.concertService.findAllUserConcerts();
  }

  @Post(':id/reservation/reserve')
  reserve(@Param('id') id: string) {
    return this.concertService.reserveSeat(+id);
  }

  @Post(':id/reservation/cancel')
  cancelReservation(@Param('id') id: string) {
    return this.concertService.cancelReservation(+id);
  }
}
