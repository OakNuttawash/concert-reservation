export enum ReservationStatus {
  RESERVE = 'RESERVE',
  CANCEL = 'CANCEL',
  NONE = 'NONE',
}

export class Reservation {
  id: number;
  concertId: number;
  concertName: string;
  userId: number;
  status: ReservationStatus;
  createdAt: Date;
}
