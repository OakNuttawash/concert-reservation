import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConcertModule } from './concert/concert.module';

@Module({
  imports: [ConcertModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
