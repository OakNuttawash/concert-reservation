import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ErrorResponse } from 'src/utils/errors';
import { ConcertService } from './concert.service';
import {
  CreateConcertDto,
  GetAdminConcertDto,
  GetAdminDashboardDto,
  GetReservationHistoryDto,
  GetUserConcertDto,
} from './dto/concert.dto';

@Controller('admin/concert')
export class AdminConcertController {
  constructor(private readonly concertService: ConcertService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new concert' })
  @ApiResponse({ status: 201, description: 'Concert created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request', type: ErrorResponse })
  create(@Body() createConcertDto: CreateConcertDto) {
    return this.concertService.createConcert(createConcertDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all concerts for admin' })
  @ApiResponse({
    status: 200,
    description: 'Concerts retrieved successfully',
    type: [GetAdminConcertDto],
  })
  @ApiResponse({
    status: 404,
    description: 'Concerts not found',
    type: ErrorResponse,
  })
  findAll() {
    return this.concertService.findAllAdminConcerts();
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a concert by ID' })
  @ApiResponse({ status: 200, description: 'Concert deleted successfully' })
  @ApiResponse({
    status: 404,
    description: 'Concert not found',
    type: ErrorResponse,
  })
  remove(@Param('id') id: string) {
    return this.concertService.removeConcert(+id);
  }

  @Get('/reservation/history')
  @ApiOperation({ summary: 'Get all reservation history' })
  @ApiResponse({
    status: 200,
    description: 'Reservation history retrieved successfully',
    type: [GetReservationHistoryDto],
  })
  @ApiResponse({
    status: 404,
    description: 'Reservation history not found',
    type: ErrorResponse,
  })
  findAllHistory() {
    return this.concertService.findAllReservationHistory();
  }

  @Get('/dashboard')
  @ApiOperation({ summary: 'Get admin dashboard information' })
  @ApiResponse({
    status: 200,
    description: 'Dashboard information retrieved successfully',
    type: GetAdminDashboardDto,
  })
  getDashboard() {
    return this.concertService.getAllDashboardData();
  }
}

@Controller('user/concert')
export class UserConcertController {
  constructor(private readonly concertService: ConcertService) {}

  @Get()
  @ApiOperation({ summary: 'Get all concerts for user' })
  @ApiResponse({
    status: 200,
    description: 'Concerts retrieved successfully',
    type: [GetUserConcertDto],
  })
  @ApiResponse({
    status: 404,
    description: 'Concerts not found',
    type: ErrorResponse,
  })
  findAll() {
    return this.concertService.findAllUserConcerts();
  }

  @Post(':id/reservation/reserve')
  @ApiOperation({ summary: 'Reserve a seat for a concert' })
  @ApiResponse({
    status: 200,
    description: 'Reservation seat reserved successfully',
  })
  reserve(@Param('id') id: string) {
    return this.concertService.reserveSeat(+id);
  }

  @Post(':id/reservation/cancel')
  @ApiOperation({ summary: 'Cancel a reservation for a concert' })
  @ApiResponse({
    status: 200,
    description: 'Reservation canceled successfully',
  })
  cancelReservation(@Param('id') id: string) {
    return this.concertService.cancelReservation(+id);
  }
}
