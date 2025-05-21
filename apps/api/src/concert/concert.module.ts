import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  AdminConcertController,
  UserConcertController,
} from './concert.controller';
import { ConcertService } from './concert.service';
import { Concert } from './entities/concert.entity';
import { Reservation, ReservationHistory } from './entities/reservation.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([Concert, Reservation, ReservationHistory]),
  ],
  controllers: [AdminConcertController, UserConcertController],
  providers: [ConcertService],
})
export class ConcertModule {}
