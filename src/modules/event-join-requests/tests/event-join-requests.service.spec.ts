import { Test, TestingModule } from '@nestjs/testing';
import { EventJoinRequestsService } from '../event-join-requests.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EventJoinRequest } from '../entities/event-join-request.entity';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Event } from '../../events/entities/event.entity';
import { EmailService } from '../../../core/messaging/email.service';
import { HttpException } from '@nestjs/common';

describe('EventJoinRequestsService', () => {
  let service: EventJoinRequestsService;
  let repository: Repository<EventJoinRequest>;
  let emailService: EmailService;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    name: 'Test User',
  } as Partial<User> as User;

  const mockEvent = {
    id: 1,
    title: 'Test Event',
    creator: {
      email: 'creator@example.com',
      name: 'Creator',
    },
  } as Partial<Event> as Event;

  const mockJoinRequest = {
    id: 1,
    eventId: 1,
    userId: 1,
    status: 'PENDING',
    user: mockUser,
    event: mockEvent,
  } as EventJoinRequest;

  const mockRepository = {
    create: jest.fn().mockReturnValue(mockJoinRequest),
    save: jest.fn().mockResolvedValue(mockJoinRequest),
    findOne: jest.fn(),
    update: jest.fn(),
  };

  const mockEmailService = {
    sendEmail: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventJoinRequestsService,
        {
          provide: getRepositoryToken(EventJoinRequest),
          useValue: mockRepository,
        },
        {
          provide: EmailService,
          useValue: mockEmailService,
        },
      ],
    }).compile();

    service = module.get<EventJoinRequestsService>(EventJoinRequestsService);
    repository = module.get<Repository<EventJoinRequest>>(
      getRepositoryToken(EventJoinRequest),
    );
    emailService = module.get<EmailService>(EmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createEventJoinRequest', () => {
    const createDto = {
      eventId: 1,
    };

    it('should create a join request and send email', async () => {
      mockRepository.findOne.mockResolvedValue(mockJoinRequest);

      const result = await service.createEventJoinRequest(createDto, 1);

      expect(result).toEqual(mockJoinRequest);
      expect(repository.create).toHaveBeenCalledWith({
        ...createDto,
        userId: 1,
      });
      expect(emailService.sendEmail).toHaveBeenCalled();
    });

    it('should throw if request already exists', async () => {
      mockRepository.save.mockRejectedValue({ code: '23505' }); // UniqueViolation

      await expect(
        service.createEventJoinRequest(createDto, 1),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('updateEventJoinRequest', () => {
    const updateDto = {
      status: 'ACCEPTED' as const,
    };

    it('should update status and send email', async () => {
      mockRepository.update.mockResolvedValue({ affected: 1 });
      mockRepository.findOne.mockResolvedValue(mockJoinRequest);

      const result = await service.updateEventJoinRequest(1, updateDto);

      expect(result).toBe(true);
      expect(repository.update).toHaveBeenCalledWith(1, updateDto);
      expect(emailService.sendEmail).toHaveBeenCalled();
    });

    it('should return false if no request was updated', async () => {
      mockRepository.update.mockResolvedValue({ affected: 0 });

      const result = await service.updateEventJoinRequest(1, updateDto);

      expect(result).toBe(false);
    });
  });
});
