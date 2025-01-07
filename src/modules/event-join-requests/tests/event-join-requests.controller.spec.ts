import { Test, TestingModule } from '@nestjs/testing';
import { EventJoinRequestsController } from '../event-join-requests.controller';
import { EventJoinRequestsService } from '../event-join-requests.service';
import { User } from '../../users/entities/user.entity';
import { EventJoinRequest } from '../entities/event-join-request.entity';
import { RequestWithUser } from '../../../core/auth/interfaces/request-with-user.interface';

describe('EventJoinRequestsController', () => {
  let controller: EventJoinRequestsController;
  let service: EventJoinRequestsService;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    name: 'Test User'
  } as Partial<User> as User;

  const mockJoinRequest = {
    id: 1,
    eventId: 1,
    userId: 1,
    status: 'PENDING'
  } as EventJoinRequest;

  const mockService = {
    createEventJoinRequest: jest.fn().mockResolvedValue(mockJoinRequest),
    updateEventJoinRequest: jest.fn().mockResolvedValue(true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventJoinRequestsController],
      providers: [
        {
          provide: EventJoinRequestsService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<EventJoinRequestsController>(EventJoinRequestsController);
    service = module.get<EventJoinRequestsService>(EventJoinRequestsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createEventJoinRequest', () => {
    const createDto = {
      eventId: 1
    };

    it('should create a join request', async () => {
      const request = { user: mockUser } as RequestWithUser;

      const result = await controller.createEventJoinRequest(createDto, request);
      
      expect(result).toEqual(mockJoinRequest);
      expect(service.createEventJoinRequest).toHaveBeenCalledWith(
        createDto,
        mockUser.id
      );
    });
  });

  describe('updateEventJoinRequest', () => {
    const updateDto = {
      status: 'ACCEPTED' as const
    };

    it('should update join request status', async () => {
      const result = await controller.updateEventJoinRequest(1, updateDto);
      
      expect(result).toBe(true);
      expect(service.updateEventJoinRequest).toHaveBeenCalledWith(1, updateDto);
    });
  });
}); 