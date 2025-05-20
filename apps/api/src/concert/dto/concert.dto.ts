import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
import { ReservationStatus } from '../entities/reservation.entity';

export class CreateConcertDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @ApiProperty()
  @IsNumber()
  @Min(10, { message: 'Total seat must be at least 10 seat' })
  totalSeat: number;

  @ApiProperty()
  @IsString()
  @MinLength(10, { message: 'Description must be at least 10 characters long' })
  description: string;
}

export class GetUserConcertDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  totalSeat: number;
  @ApiProperty()
  currentTotalSeat: number;
  @ApiProperty()
  reservationStatus: ReservationStatus;
}

export class GetAdminDashboardDto {
  @ApiProperty()
  totalSeats: number;
  @ApiProperty()
  totalReserveReservation: number;
  @ApiProperty()
  totalCancelReservation: number;
}

export class GetAdminConcertDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  totalSeat: number;
  @ApiProperty()
  currentTotalSeat: number;
}

export class GetReservationHistoryDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  concertName: string;
  @ApiProperty()
  userId: number;
  @ApiProperty()
  status: ReservationStatus;
  @ApiProperty()
  createdAt: Date;
}
