import { ReservationStatus } from '../entities/reservation.entity';

export class CreateConcertDto {
  name: string;
  totalSeat: number;
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
