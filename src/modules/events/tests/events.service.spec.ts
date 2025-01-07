import { Test, TestingModule } from '@nestjs/testing';
import { EventsService } from '../events.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Event } from '../entities/event.entity';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';

describe('EventsService', () => {
  let service: EventsService;
  let repository: Repository<Event>;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    name: 'Test User'
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
    joinRequests: []
  } as Event;

  const mockRepository = {
    create: jest.fn().mockReturnValue(mockEvent),
    save: jest.fn().mockResolvedValue(mockEvent),
    findAndCount: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: getRepositoryToken(Event),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
    repository = module.get<Repository<Event>>(getRepositoryToken(Event));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createEvent', () => {
    const createEventDto = {
      title: 'Test Event',
      description: 'Test Description',
      category: 'TEST',
      startDate: new Date(),
      endDate: new Date(),
      date: new Date()
    };

    it('should create a new event', async () => {
      const result = await service.createEvent(createEventDto, mockUser);
      
      expect(result).toEqual(mockEvent);
      expect(repository.create).toHaveBeenCalledWith({
        ...createEventDto,
        creator: mockUser
      });
      expect(repository.save).toHaveBeenCalled();
    });
  });

  describe('getAllEvents', () => {
    it('should return events with pagination', async () => {
      const mockEvents = [mockEvent];
      const mockCount = 1;
      mockRepository.findAndCount.mockResolvedValue([mockEvents, mockCount]);

      const result = await service.getAllEvents(
        'TEST',
        new Date(),
        new Date(),
        0,
        10
      );
      
      expect(result).toEqual({
        items: mockEvents,
        count: mockCount
      });
      expect(repository.findAndCount).toHaveBeenCalled();
    });

    it('should apply filters when provided', async () => {
      mockRepository.findAndCount.mockResolvedValue([[], 0]);
      const category = 'TEST';
      const startDate = new Date();
      const endDate = new Date();

      await service.getAllEvents(category, startDate, endDate, 0, 10);
      
      expect(repository.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            category,
            date: expect.any(Object)
          }),
          order: { id: 'ASC' },
          skip: 0,
          take: 10
        })
      );
    });
  });
}); 