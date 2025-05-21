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
import { ReservationStatus } from './entities/reservation.entity';

describe('ConcertController', () => {
  let adminController: AdminConcertController;
  let userController: UserConcertController;
  let validationPipe: ValidationPipe;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminConcertController, UserConcertController],
      providers: [ConcertService],
    }).compile();

    adminController = module.get<AdminConcertController>(
      AdminConcertController,
    );
    userController = module.get<UserConcertController>(UserConcertController);

    validationPipe = new ValidationPipe({ transform: true });
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
      it('should return an array of concerts', () => {
        const createConcertDto: CreateConcertDto = {
          name: 'Test Concert',
          totalSeat: 100,
          description: 'This is a test concert description',
        };

        adminController.create(createConcertDto);
        const result = adminController.findAll();

        expect(result).toHaveLength(1);
        expect(result[0]).toEqual({
          id: 1,
          ...createConcertDto,
          currentTotalSeat: 100,
        });
      });
    });

    describe('removeConcert', () => {
      it('should remove a concert', () => {
        const createConcertDto: CreateConcertDto = {
          name: 'Test Concert',
          totalSeat: 100,
          description: 'This is a test concert description',
        };

        adminController.create(createConcertDto);
        adminController.remove('1');
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
      it('should return reservation history', () => {
        const concert: CreateConcertDto = {
          name: 'Test Concert',
          totalSeat: 100,
          description: 'This is a test concert description',
        };
        adminController.create(concert);
        userController.reserve('1');
        userController.cancelReservation('1');
        const result = adminController.findAllHistory();
        expect(result).toHaveLength(2);
      });
    });

    describe('getDashboard', () => {
      it('should return dashboard data', () => {
        const createConcertDto: CreateConcertDto = {
          name: 'Test Concert',
          totalSeat: 100,
          description: 'This is a test concert description',
        };

        adminController.create(createConcertDto);
        const result = adminController.getDashboard();

        expect(result).toEqual({
          totalSeats: 100,
          totalReserveReservation: 0,
          totalCancelReservation: 0,
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
    describe('findAll', () => {
      it('should return concerts with reservation status', () => {
        const createConcertDto: CreateConcertDto = {
          name: 'Test Concert',
          totalSeat: 100,
          description: 'This is a test concert description',
        };

        adminController.create(createConcertDto);
        const result = userController.findAll();

        expect(result).toHaveLength(1);
        expect(result[0]).toEqual({
          id: 1,
          ...createConcertDto,
          currentTotalSeat: 100,
          reservationStatus: ReservationStatus.NONE,
        });
      });

      it('should return empty array when no concerts exist', () => {
        const result = userController.findAll();
        expect(result).toHaveLength(0);
      });
    });

    describe('reserve', () => {
      it('should reserve a seat successfully', () => {
        const concert = {
          id: 1,
          name: 'Test Concert',
          totalSeat: 100,
          description: 'Test Concert',
          currentTotalSeat: 99,
        };
        adminController.create(concert);
        const result = userController.reserve('1');
        expect(result).toEqual({
          id: 1,
          concertId: 1,
          concertName: 'Test Concert',
          userId: 1,
          status: ReservationStatus.RESERVE,
          createdAt: expect.any(Date) as Date,
        });
      });
      it('should throw NotFoundException when concert does not exist', () => {
        expect(() => userController.reserve('999')).toThrow(NotFoundException);
      });

      it('should throw BadRequestException when no seats available', () => {
        const concert = {
          id: 998,
          name: 'No Seats Concert',
          totalSeat: 0,
          description: 'Test Concert',
          currentTotalSeat: 0,
        };
        adminController.create(concert);
        expect(() => userController.reserve('998')).toThrow(
          BadRequestException,
        );
        expect(() => userController.reserve('998')).toThrow(
          'No more seats available',
        );
      });

      it('should throw BadRequestException when already has active reservation', () => {
        const concert = {
          id: 997,
          name: 'No Seats Concert',
          totalSeat: 100,
          description: 'Test Concert',
          currentTotalSeat: 99,
        };
        adminController.create(concert);
        userController.reserve('997');
        expect(() => userController.reserve('997')).toThrow(
          BadRequestException,
        );
        expect(() => userController.reserve('997')).toThrow(
          'You already have an active reservation for this concert',
        );
      });
    });

    describe('cancelReservation', () => {
      it('should cancel a reservation successfully', () => {
        const concert = {
          id: 1,
          name: 'Test Concert',
          totalSeat: 100,
          description: 'Test Concert',
          currentTotalSeat: 99,
        };
        adminController.create(concert);
        userController.reserve('1'); // first reserve
        const result = userController.cancelReservation('1'); // second cancel
        expect(result).toEqual({
          id: 2,
          concertId: 1,
          concertName: 'Test Concert',
          userId: 1,
          status: ReservationStatus.CANCEL,
          createdAt: expect.any(Date) as Date,
        });
      });
      it('should throw NotFoundException when concert does not exist', () => {
        expect(() => userController.cancelReservation('999')).toThrow(
          NotFoundException,
        );
      });
      it('should throw BadRequestException when reservation is already cancelled', () => {
        const concert = {
          id: 996,
          name: 'No Seats Concert',
          totalSeat: 100,
          description: 'Test Concert',
          currentTotalSeat: 99,
        };
        adminController.create(concert);
        userController.reserve('996');
        userController.cancelReservation('996');
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
