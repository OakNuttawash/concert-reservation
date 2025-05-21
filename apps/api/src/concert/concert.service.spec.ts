/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConcertService } from './concert.service';
import { Concert } from './entities/concert.entity';
import {
  Reservation,
  ReservationHistory,
  ReservationStatus,
} from './entities/reservation.entity';

describe('ConcertService', () => {
  let service: ConcertService;

  const mockConcertRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    manager: {
      transaction: jest.fn((cb) =>
        cb({
          findOne: jest.fn(),
          create: jest.fn(),
          save: jest.fn(),
          update: jest.fn(),
          delete: jest.fn(),
        }),
      ),
    },
  };

  const mockReservationRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
  };

  const mockReservationHistoryRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConcertService,
        {
          provide: getRepositoryToken(Concert),
          useValue: mockConcertRepository,
        },
        {
          provide: getRepositoryToken(Reservation),
          useValue: mockReservationRepository,
        },
        {
          provide: getRepositoryToken(ReservationHistory),
          useValue: mockReservationHistoryRepository,
        },
      ],
    }).compile();

    service = module.get<ConcertService>(ConcertService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createConcert', () => {
    it('should create a new concert', async () => {
      const createConcertDto = {
        name: 'Test Concert',
        totalSeat: 100,
        description: 'Test Description',
      };

      const expectedConcert = {
        ...createConcertDto,
        currentTotalSeat: 100,
        id: 1,
      };

      mockConcertRepository.create.mockReturnValue(expectedConcert);
      mockConcertRepository.save.mockResolvedValue(expectedConcert);

      const result = await service.createConcert(createConcertDto);
      expect(result).toEqual(expectedConcert);
    });
  });

  describe('findAllAdminConcerts', () => {
    it('should return all concerts', async () => {
      const expectedConcerts = [
        { id: 1, name: 'Concert 1', totalSeat: 100, currentTotalSeat: 100 },
        { id: 2, name: 'Concert 2', totalSeat: 200, currentTotalSeat: 200 },
      ];

      mockConcertRepository.find.mockResolvedValue(expectedConcerts);

      const result = await service.findAllAdminConcerts();
      expect(result).toEqual(expectedConcerts);
    });
  });

  describe('reserveSeat', () => {
    it('should reserve a seat successfully', async () => {
      const concertId = 1;
      const mockConcert = {
        id: concertId,
        name: 'Test Concert',
        totalSeat: 100,
        currentTotalSeat: 50,
      };

      const mockTransactionManager = {
        findOne: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
        update: jest.fn(),
      };

      mockTransactionManager.findOne
        .mockResolvedValueOnce(mockConcert)
        .mockResolvedValueOnce(null);

      mockTransactionManager.create.mockImplementation((entity, data) => data);
      mockTransactionManager.save.mockImplementation((entity, data) => data);

      mockConcertRepository.manager.transaction.mockImplementation((cb) =>
        cb(mockTransactionManager),
      );

      const result = await service.reserveSeat(concertId);

      expect(result).toBeDefined();
      expect(mockTransactionManager.update).toHaveBeenCalledWith(
        Concert,
        { id: concertId },
        { currentTotalSeat: 49 },
      );
    });

    it('should throw NotFoundException when concert not found', async () => {
      const mockTransactionManager = {
        findOne: jest.fn().mockResolvedValue(null),
      };

      mockConcertRepository.manager.transaction.mockImplementation((cb) =>
        cb(mockTransactionManager),
      );

      await expect(service.reserveSeat(999)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException when no seats available', async () => {
      const mockConcert = {
        id: 1,
        currentTotalSeat: 0,
      };

      const mockTransactionManager = {
        findOne: jest.fn().mockResolvedValue(mockConcert),
      };

      mockConcertRepository.manager.transaction.mockImplementation((cb) =>
        cb(mockTransactionManager),
      );

      await expect(service.reserveSeat(1)).rejects.toThrow(BadRequestException);
    });
  });

  describe('cancelReservation', () => {
    it('should cancel a reservation successfully', async () => {
      const concertId = 1;
      const mockConcert = {
        id: concertId,
        name: 'Test Concert',
        currentTotalSeat: 49,
      };

      const mockReservation = {
        id: 1,
        concertId,
        status: ReservationStatus.RESERVE,
      };

      const mockTransactionManager = {
        findOne: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
        update: jest.fn(),
      };

      mockTransactionManager.findOne
        .mockResolvedValueOnce(mockConcert)
        .mockResolvedValueOnce(mockReservation);

      mockTransactionManager.create.mockImplementation((entity, data) => data);
      mockTransactionManager.save.mockImplementation((entity, data) => data);

      mockConcertRepository.manager.transaction.mockImplementation((cb) =>
        cb(mockTransactionManager),
      );

      const result = await service.cancelReservation(concertId);

      expect(result).toBeDefined();
      expect(mockTransactionManager.update).toHaveBeenCalledWith(
        Concert,
        { id: concertId },
        { currentTotalSeat: 50 },
      );
    });
  });

  describe('getAllDashboardData', () => {
    it('should return dashboard data', async () => {
      const mockConcerts = [
        { currentTotalSeat: 50 },
        { currentTotalSeat: 100 },
      ];

      const mockReservationHistory = [
        { status: ReservationStatus.RESERVE },
        { status: ReservationStatus.RESERVE },
        { status: ReservationStatus.CANCEL },
      ];

      mockConcertRepository.find.mockResolvedValue(mockConcerts);
      mockReservationHistoryRepository.find.mockResolvedValue(
        mockReservationHistory,
      );

      const result = await service.getAllDashboardData();

      expect(result).toEqual({
        totalSeats: 150,
        totalReserveReservation: 2,
        totalCancelReservation: 1,
      });
    });
  });

  describe('findAllUserConcerts', () => {
    it('should return concerts with reservation status', async () => {
      const mockConcerts = [
        { id: 1, name: 'Concert 1', totalSeat: 100, currentTotalSeat: 100 },
        { id: 2, name: 'Concert 2', totalSeat: 200, currentTotalSeat: 200 },
      ];

      const mockReservation = {
        concertId: 1,
        status: ReservationStatus.RESERVE,
      };

      mockConcertRepository.find.mockResolvedValue(mockConcerts);
      mockReservationRepository.findOne.mockResolvedValueOnce(mockReservation);
      mockReservationRepository.findOne.mockResolvedValueOnce(null);

      const result = await service.findAllUserConcerts();

      expect(result).toEqual([
        { ...mockConcerts[0], reservationStatus: ReservationStatus.RESERVE },
        { ...mockConcerts[1], reservationStatus: ReservationStatus.NONE },
      ]);
    });
  });

  describe('removeConcert', () => {
    it('should remove concert and related reservations successfully', async () => {
      const concertId = 1;
      const mockConcert = {
        id: concertId,
        name: 'Test Concert',
      };

      const mockTransactionManager = {
        findOne: jest.fn().mockResolvedValue(mockConcert),
        delete: jest.fn().mockResolvedValue(undefined),
      };

      mockConcertRepository.manager.transaction.mockImplementation((cb) =>
        cb(mockTransactionManager),
      );

      await service.removeConcert(concertId);

      expect(mockTransactionManager.delete).toHaveBeenCalledWith(Reservation, {
        concertId,
      });
      expect(mockTransactionManager.delete).toHaveBeenCalledWith(
        ReservationHistory,
        { concertId },
      );
      expect(mockTransactionManager.delete).toHaveBeenCalledWith(Concert, {
        id: concertId,
      });
    });

    it('should throw NotFoundException when concert not found', async () => {
      const mockTransactionManager = {
        findOne: jest.fn().mockResolvedValue(null),
      };

      mockConcertRepository.manager.transaction.mockImplementation((cb) =>
        cb(mockTransactionManager),
      );

      await expect(service.removeConcert(999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('reserveSeat', () => {
    it('should throw BadRequestException when user already has active reservation', async () => {
      const mockConcert = {
        id: 1,
        currentTotalSeat: 50,
      };

      const mockExistingReservation = {
        id: 1,
        status: ReservationStatus.RESERVE,
      };

      const mockTransactionManager = {
        findOne: jest
          .fn()
          .mockResolvedValueOnce(mockConcert)
          .mockResolvedValueOnce(mockExistingReservation),
      };

      mockConcertRepository.manager.transaction.mockImplementation((cb) =>
        cb(mockTransactionManager),
      );

      await expect(service.reserveSeat(1)).rejects.toThrow(
        'You already have an active reservation for this concert',
      );
    });
  });

  describe('cancelReservation', () => {
    it('should throw NotFoundException when reservation not found', async () => {
      const mockConcert = {
        id: 1,
        name: 'Test Concert',
      };

      const mockTransactionManager = {
        findOne: jest
          .fn()
          .mockResolvedValueOnce(mockConcert)
          .mockResolvedValueOnce(null),
      };

      mockConcertRepository.manager.transaction.mockImplementation((cb) =>
        cb(mockTransactionManager),
      );

      await expect(service.cancelReservation(1)).rejects.toThrow(
        'Reservation not found',
      );
    });

    it('should throw BadRequestException when reservation is already cancelled', async () => {
      const mockConcert = {
        id: 1,
        name: 'Test Concert',
      };

      const mockReservation = {
        id: 1,
        status: ReservationStatus.CANCEL,
      };

      const mockTransactionManager = {
        findOne: jest
          .fn()
          .mockResolvedValueOnce(mockConcert)
          .mockResolvedValueOnce(mockReservation),
      };

      mockConcertRepository.manager.transaction.mockImplementation((cb) =>
        cb(mockTransactionManager),
      );

      await expect(service.cancelReservation(1)).rejects.toThrow(
        'Reservation is already cancelled',
      );
    });
  });

  describe('findAllReservationHistory', () => {
    it('should return all reservation history', async () => {
      const mockHistory = [
        {
          id: 1,
          userId: 1,
          status: ReservationStatus.RESERVE,
          concertName: 'Concert 1',
          createdAt: new Date(),
        },
        {
          id: 2,
          userId: 1,
          status: ReservationStatus.CANCEL,
          concertName: 'Concert 2',
          createdAt: new Date(),
        },
      ];

      mockReservationHistoryRepository.find.mockResolvedValue(mockHistory);

      const result = await service.findAllReservationHistory();

      expect(result).toEqual(
        mockHistory.map((history) => ({
          id: history.id,
          userId: history.userId,
          status: history.status,
          concertName: history.concertName,
          createdAt: history.createdAt,
        })),
      );
    });
  });
});
