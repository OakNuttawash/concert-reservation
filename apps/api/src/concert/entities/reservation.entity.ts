export enum ReservationStatus {
  RESERVE = 'RESERVE',
  CANCEL = 'CANCEL',
  NONE = 'NONE',
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
