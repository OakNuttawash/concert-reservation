import {
  BadRequestException,
  NotFoundException,
  ValidationPipe,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import {
  AdminConcertController,
  UserConcertController,
} from './concert.controller';
import { ConcertService } from './concert.service';
import { CreateConcertDto } from './dto/concert.dto';
import { Concert } from './entities/concert.entity';
import {
  Reservation,
  ReservationHistory,
  ReservationStatus,
} from './entities/reservation.entity';

describe('ConcertController', () => {
  let adminController: AdminConcertController;
  let userController: UserConcertController;
  let validationPipe: ValidationPipe;

  let mockConcerts: Concert[] = [];
  let mockReservations: Reservation[] = [];
  let mockReservationHistory: ReservationHistory[] = [];
  let concertIdCounter = 1;
  let reservationIdCounter = 1;
  let reservationHistoryIdCounter = 1;

  beforeEach(async () => {
    mockConcerts = [];
    mockReservations = [];
    mockReservationHistory = [];
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminConcertController, UserConcertController],
      providers: [
        {
          provide: ConcertService,
          //Mock the service
          useValue: {
            createConcert: jest.fn((dto: CreateConcertDto) => {
              const concert = {
                id: concertIdCounter++,
                ...dto,
                currentTotalSeat: dto.totalSeat,
                reservations: [],
              };
              mockConcerts.push(concert);
              return concert;
            }),
            findAllAdminConcerts: jest.fn(() => {
              return mockConcerts;
            }),
            findAllUserConcerts: jest.fn(() => {
              const userId = 1;
              return mockConcerts.map((concert) => {
                const reservation = mockReservations.find(
                  (r) => r.concertId === concert.id && r.userId === userId,
                );
                return {
                  ...concert,
                  reservationStatus:
                    reservation?.status || ReservationStatus.NONE,
                };
              });
            }),
            removeConcert: jest.fn((id: number) => {
              const concertIndex = mockConcerts.findIndex((c) => c.id === id);
              if (concertIndex === -1) {
                throw new NotFoundException('Concert not found');
              }
              mockConcerts.splice(concertIndex, 1);
              mockReservations = mockReservations.filter(
                (r) => r.concertId !== id,
              );
              mockReservationHistory = mockReservationHistory.filter(
                (r) => r.concertId !== id,
              );
            }),
            reserveSeat: jest.fn((concertId: number) => {
              const userId = 1;
              const concert = mockConcerts.find((c) => c.id === concertId);

              if (!concert) {
                throw new NotFoundException('Concert not found');
              }
              if (concert.currentTotalSeat <= 0) {
                throw new BadRequestException('No more seats available');
              }

              const existingReservation = mockReservations.find(
                (r) => r.concertId === concertId && r.userId === userId,
              );

              if (existingReservation?.status === ReservationStatus.RESERVE) {
                throw new BadRequestException(
                  'You already have an active reservation for this concert',
                );
              }

              const reservation: Reservation = {
                id: reservationIdCounter++,
                concertId,
                concertName: concert.name,
                userId,
                status: ReservationStatus.RESERVE,
                createdAt: new Date(),
                concert: concert,
              };

              const history: ReservationHistory = {
                id: reservationHistoryIdCounter++,
                concertId,
                concertName: concert.name,
                userId,
                status: ReservationStatus.RESERVE,
                createdAt: new Date(),
              };

              concert.currentTotalSeat--;
              mockReservations.push(reservation);
              mockReservationHistory.push(history);
              return reservation;
            }),
            cancelReservation: jest.fn((concertId: number) => {
              const userId = 1;
              const concert = mockConcerts.find((c) => c.id === concertId);

              if (!concert) {
                throw new NotFoundException('Concert not found');
              }

              const reservation = mockReservations.find(
                (r) => r.concertId === concertId && r.userId === userId,
              );

              if (!reservation) {
                throw new NotFoundException('Reservation not found');
              }

              if (reservation.status === ReservationStatus.CANCEL) {
                throw new BadRequestException(
                  'Reservation is already cancelled',
                );
              }

              const history = {
                id: reservationHistoryIdCounter++,
                concertId,
                concertName: concert.name,
                userId,
                status: ReservationStatus.CANCEL,
                createdAt: new Date(),
              };

              reservation.status = ReservationStatus.CANCEL;
              concert.currentTotalSeat++;
              mockReservationHistory.push(history);
              return reservation;
            }),
            findAllReservationHistory: jest.fn(() => {
              return mockReservationHistory.sort(
                (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
              );
            }),
            getAllDashboardData: jest.fn(() => {
              return {
                totalSeats: mockConcerts.reduce(
                  (sum, concert) => sum + concert.currentTotalSeat,
                  0,
                ),
                totalReserveReservation: mockReservationHistory.filter(
                  (history) => history.status === ReservationStatus.RESERVE,
                ).length,
                totalCancelReservation: mockReservationHistory.filter(
                  (history) => history.status === ReservationStatus.CANCEL,
                ).length,
              };
            }),
          },
        },
      ],
    }).compile();

    adminController = module.get<AdminConcertController>(
      AdminConcertController,
    );
    userController = module.get<UserConcertController>(UserConcertController);

    validationPipe = new ValidationPipe({ transform: true });
  });

  afterEach(() => {
    mockConcerts = [];
    mockReservations = [];
    mockReservationHistory = [];
    concertIdCounter = 1;
    reservationIdCounter = 1;
    reservationHistoryIdCounter = 1;
  });

  describe('AdminConcertController', () => {
    describe('createConcert', () => {
      it('should create a new concert', () => {
        const createConcertDto: CreateConcertDto = {
          name: 'Test Concert',
          totalSeat: 100,
          description: 'This is a test concert description',
        };

        const result = adminController.create(createConcertDto);

        expect(result).toEqual({
          id: 1,
          ...createConcertDto,
          currentTotalSeat: 100,
          reservations: [],
        });
      });
      it('should throw BadRequestException if totalSeat is less than 10', async () => {
        const createConcertDto: CreateConcertDto = {
          name: 'Test Concert',
          totalSeat: 0,
          description: 'This is a test concert description',
        };

        await expect(
          validationPipe.transform(createConcertDto, {
            type: 'body',
            metatype: CreateConcertDto,
          }),
        ).rejects.toThrow(BadRequestException);
      });
      it('should throw BadRequestException if name is empty', async () => {
        const createConcertDto: CreateConcertDto = {
          name: '',
          totalSeat: 100,
          description: 'This is a test concert description',
        };
        await expect(
          validationPipe.transform(createConcertDto, {
            type: 'body',
            metatype: CreateConcertDto,
          }),
        ).rejects.toThrow(BadRequestException);
      });
      it('should throw BadRequestException if description is empty', async () => {
        const createConcertDto: CreateConcertDto = {
          name: 'Test Concert',
          totalSeat: 100,
          description: '',
        };
        await expect(
          validationPipe.transform(createConcertDto, {
            type: 'body',
            metatype: CreateConcertDto,
          }),
        ).rejects.toThrow(BadRequestException);
      });
    });

    describe('findAllAdminConcert', () => {
      it('should return an array of concerts', async () => {
        const createConcertDto: CreateConcertDto = {
          name: 'Test Concert',
          totalSeat: 100,
          description: 'This is a test concert description',
        };

        await adminController.create(createConcertDto);
        const result = adminController.findAll();

        expect(result).toHaveLength(1);
        expect(result[0]).toEqual({
          id: 1,
          ...createConcertDto,
          currentTotalSeat: 100,
          reservations: [],
        });
      });
    });

    describe('removeConcert', () => {
      it('should remove a concert', async () => {
        const createConcertDto: CreateConcertDto = {
          name: 'Test Concert',
          totalSeat: 100,
          description: 'This is a test concert description',
        };

        await adminController.create(createConcertDto);
        await adminController.remove('1');
        const result = adminController.findAll();

        expect(result).toHaveLength(0);
      });

      it('should throw NotFoundException when removing non-existent concert', () => {
        expect(() => adminController.remove('999')).toThrow(NotFoundException);
      });
    });

    describe('findAllHistory', () => {
      it('should return empty array when no reservation history exists', () => {
        const result = adminController.findAllHistory();
        expect(result).toHaveLength(0);
      });
      it('should return reservation history', async () => {
        const concert: CreateConcertDto = {
          name: 'Test Concert',
          totalSeat: 100,
          description: 'This is a test concert description',
        };
        await adminController.create(concert);
        await userController.reserve('1');
        await userController.cancelReservation('1');
        const result = adminController.findAllHistory();
        expect(result).toHaveLength(2);
      });
    });

    describe('getDashboard', () => {
      it('should return dashboard data', async () => {
        const createConcertDto: CreateConcertDto = {
          name: 'Test Concert',
          totalSeat: 100,
          description: 'This is a test concert description',
        };

        await adminController.create(createConcertDto);
        await userController.reserve('1');
        await userController.cancelReservation('1');
        const result = adminController.getDashboard();

        expect(result).toEqual({
          totalSeats: 100,
          totalReserveReservation: 1,
          totalCancelReservation: 1,
        });
      });

      it('should return zero counts when no data exists', () => {
        const result = adminController.getDashboard();
        expect(result).toEqual({
          totalSeats: 0,
          totalReserveReservation: 0,
          totalCancelReservation: 0,
        });
      });
    });
  });

  describe('UserConcertController', () => {
    describe('findAllConcert', () => {
      it('should return concerts with none reservation status', async () => {
        const createConcertDto: CreateConcertDto = {
          name: 'Test Concert',
          totalSeat: 100,
          description: 'This is a test concert description',
        };

        await adminController.create(createConcertDto);

        const result = userController.findAll();

        expect(result).toHaveLength(1);
        expect(result[0]).toEqual({
          id: 1,
          ...createConcertDto,
          currentTotalSeat: 100,
          reservationStatus: ReservationStatus.NONE,
          reservations: [],
        });
      });
      it('should return concerts with reservation status', async () => {
        const createConcertDto: CreateConcertDto = {
          name: 'Test Concert',
          totalSeat: 100,
          description: 'This is a test concert description',
        };

        await adminController.create(createConcertDto);
        await userController.reserve('1');
        const result = userController.findAll();

        expect(result).toHaveLength(1);
        expect(result[0]).toEqual({
          id: 1,
          ...createConcertDto,
          currentTotalSeat: 99,
          reservationStatus: ReservationStatus.RESERVE,
          reservations: [],
        });
      });

      it('should return empty array when no concerts exist', () => {
        const result = userController.findAll();
        expect(result).toHaveLength(0);
      });
    });

    describe('reserve', () => {
      it('should reserve a seat successfully', async () => {
        const concertInput = {
          id: 1,
          name: 'Test Concert',
          totalSeat: 100,
          description: 'Test Concert',
          currentTotalSeat: 99,
        };
        const concert = await adminController.create(concertInput);
        const result = userController.reserve('1');
        expect(result).toEqual({
          id: 1,
          concertId: 1,
          concertName: 'Test Concert',
          userId: 1,
          status: ReservationStatus.RESERVE,
          createdAt: expect.any(Date) as Date,
          concert: concert,
        });
      });
      it('should throw NotFoundException when concert does not exist', () => {
        expect(() => userController.reserve('999')).toThrow(NotFoundException);
      });

      it('should throw BadRequestException when no seats available', async () => {
        const concert = {
          id: 998,
          name: 'No Seats Concert',
          totalSeat: 0,
          description: 'Test Concert',
          currentTotalSeat: 0,
        };
        await adminController.create(concert);
        expect(() => userController.reserve('998')).toThrow(
          BadRequestException,
        );
        expect(() => userController.reserve('998')).toThrow(
          'No more seats available',
        );
      });

      it('should throw BadRequestException when already has active reservation', async () => {
        const concert = {
          id: 997,
          name: 'No Seats Concert',
          totalSeat: 100,
          description: 'Test Concert',
          currentTotalSeat: 99,
        };
        await adminController.create(concert);
        await userController.reserve('997');
        expect(() => userController.reserve('997')).toThrow(
          BadRequestException,
        );
        expect(() => userController.reserve('997')).toThrow(
          'You already have an active reservation for this concert',
        );
      });
    });

    describe('cancelReservation', () => {
      it('should cancel a reservation successfully', async () => {
        const concertInput = {
          id: 1,
          name: 'Test Concert',
          totalSeat: 100,
          description: 'Test Concert',
          currentTotalSeat: 99,
        };
        const concert = await adminController.create(concertInput);
        await userController.reserve('1'); // first reserve
        const result = userController.cancelReservation('1'); // second cancel
        expect(result).toEqual({
          id: 1,
          concertId: 1,
          concertName: 'Test Concert',
          userId: 1,
          status: ReservationStatus.CANCEL,
          createdAt: expect.any(Date) as Date,
          concert: concert,
        });
      });
      it('should throw NotFoundException when concert does not exist', () => {
        expect(() => userController.cancelReservation('999')).toThrow(
          NotFoundException,
        );
      });
      it('should throw NotFoundException when reservation not exist', async () => {
        const concert = {
          id: 995,
          name: 'No Seats Concert',
          totalSeat: 100,
          description: 'Test Concert',
          currentTotalSeat: 99,
        };
        await adminController.create(concert);
        expect(() => userController.cancelReservation('995')).toThrow(
          NotFoundException,
        );
      });
      it('should throw BadRequestException when reservation is already cancelled', async () => {
        const concert = {
          id: 996,
          name: 'No Seats Concert',
          totalSeat: 100,
          description: 'Test Concert',
          currentTotalSeat: 99,
        };
        await adminController.create(concert);
        await userController.reserve('996');
        await userController.cancelReservation('996');
        expect(() => userController.cancelReservation('996')).toThrow(
          BadRequestException,
        );
        expect(() => userController.cancelReservation('996')).toThrow(
          'Reservation is already cancelled',
        );
      });
    });
  });
});
