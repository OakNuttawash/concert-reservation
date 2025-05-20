export enum ReservationStatus {
  RESERVE = 'RESERVE',
  CANCEL = 'CANCEL',
}

export class Reservation {
  id: number;
  concertId: number;
  userId: number;
  status: ReservationStatus;
}

export class ReservationHistory {
  reservation: Reservation;
  createdAt: Date;
}
