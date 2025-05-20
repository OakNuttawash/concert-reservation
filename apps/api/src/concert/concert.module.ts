import { Module } from '@nestjs/common';
import {
  AdminConcertController,
  UserConcertController,
} from './concert.controller';
import { ConcertService } from './concert.service';

@Module({
  controllers: [AdminConcertController, UserConcertController],
  providers: [ConcertService],
})
export class ConcertModule {}
