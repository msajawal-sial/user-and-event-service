import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { RequestWithUser } from '../../core/auth/interfaces/request-with-user.interface';
import { JwtAuthGuard } from '../../core/auth/guards/jwt-auth.guard';
import { PaginationParams } from '../../shared/interfaces/pagination.interface';
import { SearchEventDto } from './dto/search-event.dto';
import { Event } from './entities/event.entity';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';

@Controller('events')
@ApiTags('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @HttpCode(200)
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new event' })
  @ApiBody({ type: CreateEventDto })
  @ApiResponse({
    status: 200,
    description: 'Event has been successfully created',
    type: Event,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createEvent(
    @Body() event: CreateEventDto,
    @Req() req: RequestWithUser,
  ): Promise<Event> {
    return this.eventsService.createEvent(event, req.user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all events with filters and pagination' })
  @ApiQuery({ name: 'category', required: false, type: String })
  @ApiQuery({ name: 'startDate', required: false, type: Date })
  @ApiQuery({ name: 'endDate', required: false, type: Date })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'List of events retrieved successfully',
    schema: {
      properties: {
        items: {
          type: 'array',
          items: { $ref: '#/components/schemas/Event' },
        },
        count: {
          type: 'number',
          description: 'Total number of events',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async getAllEvents(
    @Query() { category, startDate, endDate }: SearchEventDto,
    @Query() { offset, limit }: PaginationParams,
  ): Promise<{ items: Event[]; count: number }> {
    return this.eventsService.getAllEvents(
      category,
      startDate,
      endDate,
      offset,
      limit,
    );
  }
}
