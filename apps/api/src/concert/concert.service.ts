import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
  constructor(
    @InjectRepository(Concert)
    private concertRepository: Repository<Concert>,
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
    @InjectRepository(ReservationHistory)
    private reservationHistoryRepository: Repository<ReservationHistory>,
  ) {}

  async createConcert(createConcertDto: CreateConcertDto): Promise<Concert> {
    const concert = this.concertRepository.create({
      ...createConcertDto,
      currentTotalSeat: createConcertDto.totalSeat,
    });
    return this.concertRepository.save(concert);
  }

  async findAllAdminConcerts(): Promise<GetAdminConcertDto[]> {
    return this.concertRepository.find();
  }

  async findAllUserConcerts(): Promise<GetUserConcertDto[]> {
    const userId = 1; // Mock user
    const concerts = await this.concertRepository.find();

    const concertsWithStatus = await Promise.all(
      concerts.map(async (concert) => {
        const reservation = await this.reservationRepository.findOne({
          where: { concertId: concert.id, userId },
          order: { createdAt: 'DESC' },
        });

        return {
          ...concert,
          reservationStatus: reservation?.status || ReservationStatus.NONE,
        };
      }),
    );

    return concertsWithStatus;
  }

  async removeConcert(id: number): Promise<void> {
    await this.concertRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const concert = await transactionalEntityManager.findOne(Concert, {
          where: { id },
        });

        if (!concert) {
          throw new NotFoundException('Concert not found');
        }

        await transactionalEntityManager.delete(Reservation, { concertId: id });

        await transactionalEntityManager.delete(ReservationHistory, {
          concertId: id,
        });

        await transactionalEntityManager.delete(Concert, { id });
      },
    );
  }

  async reserveSeat(concertId: number): Promise<Reservation> {
    const userId = 1; // Mock user

    return await this.concertRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const concert = await transactionalEntityManager.findOne(Concert, {
          where: { id: concertId },
        });

        if (!concert) {
          throw new NotFoundException('Concert not found');
        }

        if (concert.currentTotalSeat <= 0) {
          throw new BadRequestException('No more seats available');
        }

        const existingReservation = await transactionalEntityManager.findOne(
          Reservation,
          {
            where: { concertId, userId },
          },
        );

        if (existingReservation?.status === ReservationStatus.RESERVE) {
          throw new BadRequestException(
            'You already have an active reservation for this concert',
          );
        }

        // Create or update reservation
        const reservation =
          existingReservation ||
          transactionalEntityManager.create(Reservation, {
            concertId,
            concertName: concert.name,
            userId,
          });
        reservation.status = ReservationStatus.RESERVE;

        // Create reservation history
        const reservationHistory = transactionalEntityManager.create(
          ReservationHistory,
          {
            concertId,
            concertName: concert.name,
            userId,
            status: ReservationStatus.RESERVE,
          },
        );

        // Update concert seat count
        await transactionalEntityManager.update(
          Concert,
          { id: concertId },
          { currentTotalSeat: concert.currentTotalSeat - 1 },
        );

        await transactionalEntityManager.save(
          ReservationHistory,
          reservationHistory,
        );
        return transactionalEntityManager.save(Reservation, reservation);
      },
    );
  }

  async cancelReservation(concertId: number): Promise<Reservation> {
    const userId = 1; // Mock user

    return await this.concertRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const concert = await transactionalEntityManager.findOne(Concert, {
          where: { id: concertId },
        });

        if (!concert) {
          throw new NotFoundException('Concert not found');
        }

        const reservation = await transactionalEntityManager.findOne(
          Reservation,
          {
            where: { concertId, userId },
          },
        );

        if (!reservation) {
          throw new NotFoundException('Reservation not found');
        }

        if (reservation.status === ReservationStatus.CANCEL) {
          throw new BadRequestException('Reservation is already cancelled');
        }

        reservation.status = ReservationStatus.CANCEL;

        const reservationHistory = transactionalEntityManager.create(
          ReservationHistory,
          {
            concertId,
            concertName: concert.name,
            userId,
            status: ReservationStatus.CANCEL,
          },
        );

        await transactionalEntityManager.update(
          Concert,
          { id: concertId },
          { currentTotalSeat: concert.currentTotalSeat + 1 },
        );

        await transactionalEntityManager.save(
          ReservationHistory,
          reservationHistory,
        );
        return transactionalEntityManager.save(Reservation, reservation);
      },
    );
  }

  async findAllReservationHistory(): Promise<GetReservationHistoryDto[]> {
    const reservationHistory = await this.reservationHistoryRepository.find({
      order: { createdAt: 'DESC' },
    });

    return reservationHistory.map((history) => ({
      id: history.id,
      userId: history.userId,
      status: history.status,
      concertName: history.concertName,
      createdAt: history.createdAt,
    }));
  }

  async getAllDashboardData(): Promise<GetAdminDashboardDto> {
    const [concerts, reservationHistory] = await Promise.all([
      this.concertRepository.find(),
      this.reservationHistoryRepository.find(),
    ]);

    return {
      totalSeats: concerts.reduce(
        (sum, concert) => sum + concert.currentTotalSeat,
        0,
      ),
      totalReserveReservation: reservationHistory.filter(
        (history) => history.status === ReservationStatus.RESERVE,
      ).length,
      totalCancelReservation: reservationHistory.filter(
        (history) => history.status === ReservationStatus.CANCEL,
      ).length,
    };
  }
}
