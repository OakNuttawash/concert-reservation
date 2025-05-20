import { Injectable } from '@nestjs/common';
import {
  CreateConcertDto,
  GetAdminConcertDto,
  GetAdminDashboardDto,
  GetReservationHistoryDto,
  GetUserConcertDto,
} from './dto/concert.dto';

import { Concert } from './entities/concert.entity';
import { Reservation, ReservationStatus } from './entities/reservation.entity';

@Injectable()
export class ConcertService {
  // This is mock data. If restart server, all data will be reset
  private concerts: Concert[] = [];
  private reservations: Reservation[] = [];
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
      const reservation = this.reservations.findLast(
        (reservation) =>
          reservation.concertId === concert.id && reservation.userId === userId,
      );
      return {
        ...concert,
        reservationStatus: reservation?.status || ReservationStatus.NONE,
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

    const existingReservation = this.reservations.findLast(
      (reservation) =>
        reservation.concertId === concertId && reservation.userId === userId,
    );
    if (
      existingReservation &&
      existingReservation.status === ReservationStatus.RESERVE
    ) {
      throw new Error(
        'You already have an active reservation for this concert',
      );
    }

    const newReservation: Reservation = {
      id: this.reservationId++,
      concertId,
      concertName: concert.name,
      userId,
      status: ReservationStatus.RESERVE,
      createdAt: new Date(),
    };
    this.reservations.push(newReservation);

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

    const reservation = this.reservations.findLast(
      (reservation) =>
        reservation.concertId === concertId && reservation.userId === userId,
    );

    if (!reservation) {
      throw new Error('Reservation not found');
    }

    if (reservation.status === ReservationStatus.CANCEL) {
      throw new Error('Reservation is already cancelled');
    }

    const cancelReservation: Reservation = {
      ...reservation,
      id: this.reservationId++,
      createdAt: new Date(),
      status: ReservationStatus.CANCEL,
    };

    this.reservations.push(cancelReservation);

    concert.currentTotalSeat++;
    return reservation;
  }

  findAllReservationHistory(): GetReservationHistoryDto[] {
    const reservationHistories = this.reservations.map((reservationHistory) => {
      return {
        id: reservationHistory.id,
        userId: reservationHistory.userId,
        status: reservationHistory.status,
        concertName: reservationHistory.concertName,
        createdAt: reservationHistory.createdAt,
      };
    });
    return reservationHistories;
  }

  getAllDashboardData(): GetAdminDashboardDto {
    return {
      // total concert remaining seat
      totalSeats: this.concerts.reduce(
        (sum, concert) => sum + concert.currentTotalSeat,
        0,
      ),
      // total reserve seat history
      totalReserveReservation: this.reservations.filter(
        (reservation) => reservation.status === ReservationStatus.RESERVE,
      ).length,

      // total cancel seat history
      totalCancelReservation: this.reservations.filter(
        (reservation) => reservation.status === ReservationStatus.CANCEL,
      ).length,
    };
  }
}
