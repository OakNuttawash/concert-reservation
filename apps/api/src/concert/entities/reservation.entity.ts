import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Concert } from './concert.entity';

export enum ReservationStatus {
  RESERVE = 'RESERVE',
  CANCEL = 'CANCEL',
  NONE = 'NONE',
}

@Entity()
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column({
    type: 'enum',
    enum: ReservationStatus,
    default: ReservationStatus.NONE,
  })
  status: ReservationStatus;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  concertName: string;

  @Column()
  concertId: number;

  @ManyToOne(() => Concert, (concert) => concert.reservations)
  concert: Concert;
}

@Entity()
export class ReservationHistory {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  userId: number;
  @Column({
    type: 'enum',
    enum: ReservationStatus,
    default: ReservationStatus.NONE,
  })
  status: ReservationStatus;
  @CreateDateColumn()
  createdAt: Date;
  @Column()
  concertName: string;
  @Column()
  concertId: number;
}
