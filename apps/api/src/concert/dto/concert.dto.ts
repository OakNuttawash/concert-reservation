import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
import { ReservationStatus } from '../entities/reservation.entity';

export class CreateConcertDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsNumber()
  @Min(10, { message: 'Total seat must be at least 10 seat' })
  totalSeat: number;

  @IsString()
  @MinLength(10, { message: 'Description must be at least 10 characters long' })
  description: string;
}

export class GetUserConcertDto {
  id: number;
  name: string;
  description: string;
  totalSeat: number;
  currentTotalSeat: number;
  reservationStatus: ReservationStatus;
}

export class GetAdminDashboardDto {
  totalSeats: number;
  totalReserveReservation: number;
  totalCancelReservation: number;
}

export class GetAdminConcertDto {
  id: number;
  name: string;
  description: string;
  totalSeat: number;
  currentTotalSeat: number;
}

export class GetReservationHistoryDto {
  id: number;
  concertName: string;
  userId: number;
  status: ReservationStatus;
  createdAt: Date;
}
