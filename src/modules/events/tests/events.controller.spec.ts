import { Test, TestingModule } from '@nestjs/testing';
import { EventsController } from '../events.controller';
import { EventsService } from '../events.service';
import { Event } from '../entities/event.entity';
import { User } from '../../users/entities/user.entity';
import { RequestWithUser } from '../../../core/auth/interfaces/request-with-user.interface';

describe('EventsController', () => {
  let controller: EventsController;
  let service: EventsService;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    name: 'Test User',
  } as Partial<User> as User;

  const mockEvent = {
    id: 1,
    title: 'Test Event',
    description: 'Test Description',
    category: 'TEST',
    startDate: new Date(),
    endDate: new Date(),
    creator: mockUser,
    date: new Date(),
    joinRequests: [],
  } as Event;

  const mockEventsService = {
    createEvent: jest.fn().mockResolvedValue(mockEvent),
    getAllEvents: jest.fn().mockResolvedValue({
      items: [mockEvent],
      count: 1,
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventsController],
      providers: [
        {
          provide: EventsService,
          useValue: mockEventsService,
        },
      ],
    }).compile();

    controller = module.get<EventsController>(EventsController);
    service = module.get<EventsService>(EventsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createEvent', () => {
    const createEventDto = {
      title: 'Test Event',
      description: 'Test Description',
      category: 'TEST',
      startDate: new Date(),
      endDate: new Date(),
      date: new Date(),
    };

    it('should create a new event', async () => {
      const request = { user: mockUser } as RequestWithUser;

      const result = await controller.createEvent(createEventDto, request);

      expect(result).toEqual(mockEvent);
      expect(service.createEvent).toHaveBeenCalledWith(
        createEventDto,
        mockUser,
      );
    });
  });

  describe('getAllEvents', () => {
    it('should return events with pagination', async () => {
      const searchParams = {
        category: 'TEST',
        startDate: new Date(),
        endDate: new Date(),
      };
      const paginationParams = {
        offset: 0,
        limit: 10,
      };

      const result = await controller.getAllEvents(
        searchParams,
        paginationParams,
      );

      expect(result).toEqual({
        items: [mockEvent],
        count: 1,
      });
      expect(service.getAllEvents).toHaveBeenCalledWith(
        searchParams.category,
        searchParams.startDate,
        searchParams.endDate,
        paginationParams.offset,
        paginationParams.limit,
      );
    });
  });
});
