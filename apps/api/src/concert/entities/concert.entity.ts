import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Reservation } from './reservation.entity';

@Entity()
export class Concert {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  totalSeat: number;

  @Column()
  currentTotalSeat: number;

  @Column()
  description: string;

  @OneToMany(() => Reservation, (reservation) => reservation.concertId)
  reservations: Reservation[];
}
