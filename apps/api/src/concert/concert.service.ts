import { Injectable } from '@nestjs/common';
import {
  CreateConcertDto,
  GetAdminConcertDto,
  GetAdminDashboardDto,
  GetReservationHistoryDto,
  GetUserConcertDto,
} from './dto/concert.dto';

import { Concert } from './entities/concert.entity';
import {
  Reservation,
  ReservationHistory,
  ReservationStatus,
} from './entities/reservation.entity';

@Injectable()
export class ConcertService {
  // This is mock data. If restart server, all data will be reset
  private concerts: Concert[] = [];
  private reservations: Reservation[] = [];
  private reservationHistories: ReservationHistory[] = [];
  private concertId = 1;
  private reservationId = 1;

  createConcert(createConcertDto: CreateConcertDto): Concert {
    const newConcert: Concert = {
      id: this.concertId++,
      ...createConcertDto,
      currentTotalSeat: createConcertDto.totalSeat,
    };

    this.concerts.push(newConcert);
    return newConcert;
  }

  findAllAdminConcerts(): GetAdminConcertDto[] {
    return this.concerts;
  }

  findAllUserConcerts(): GetUserConcertDto[] {
    // This userId is mock user, have 2 role : admin and user
    const userId = 1;
    return this.concerts.map((concert) => {
      const reservation = this.reservations.find(
        (reservation) =>
          reservation.concertId === concert.id && reservation.userId === userId,
      );
      return {
        ...concert,
        reservationStatus: reservation?.status || ReservationStatus.RESERVE,
      };
    });
  }

  removeConcert(id: number) {
    this.concerts = this.concerts.filter((concert) => concert.id !== id);
    return;
  }

  reserveSeat(concertId: number): Reservation {
    // This userId is mock user, have 2 role : admin and user
    const userId = 1;
    const concert = this.concerts.find((concert) => concert.id === concertId);
    if (!concert) {
      throw new Error('Concert not found');
    }
    if (concert.currentTotalSeat <= 0) {
      throw new Error('No more seats available');
    }
    const newReservation: Reservation = {
      id: this.reservationId++,
      concertId,
      userId,
      status: ReservationStatus.RESERVE,
    };
    this.reservations.push(newReservation);
    this.reservationHistories.push({
      reservation: newReservation,
      createdAt: new Date(),
    });
    concert.currentTotalSeat--;
    return newReservation;
  }

  cancelReservation(concertId: number): Reservation {
    // This userId is mock user, have 2 role : admin and user
    const userId = 1;
    const concert = this.concerts.find((concert) => concert.id === concertId);
    if (!concert) {
      throw new Error('Concert not found');
    }

    const reservation = this.reservations.find(
      (reservation) =>
        reservation.concertId === concertId && reservation.userId === userId,
    );

    if (!reservation) {
      throw new Error('Reservation not found');
    }
    this.reservationHistories.push({
      reservation,
      createdAt: new Date(),
    });
    reservation.status = ReservationStatus.CANCEL;
    concert.currentTotalSeat++;
    return reservation;
  }

  findAllReservationHistory(): GetReservationHistoryDto[] {
    const reservationHistories = this.reservationHistories.map(
      (reservationHistory) => {
        const concert = this.concerts.find(
          (concert) => concert.id === reservationHistory.reservation.concertId,
        );
        return {
          id: reservationHistory.reservation.id,
          userId: reservationHistory.reservation.userId,
          status: reservationHistory.reservation.status,
          concertName: concert?.name || '',
          createdAt: reservationHistory.createdAt,
        };
      },
    );
    return reservationHistories;
  }

  getAllDashboardData(): GetAdminDashboardDto {
    return {
      totalSeats: this.concerts.reduce(
        (sum, concert) => sum + concert.currentTotalSeat,
        0,
      ),
      totalReserveReservation: this.reservations.filter(
        (reservation) => reservation.status === ReservationStatus.RESERVE,
      ).length,
      totalCancelReservation: this.reservations.filter(
        (reservation) => reservation.status === ReservationStatus.CANCEL,
      ).length,
    };
  }
}
