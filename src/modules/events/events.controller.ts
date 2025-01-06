import { 
    Body,
    Controller,
    Get,
    HttpCode,
    Post,
    Query,
    Req,
    UseGuards
} from "@nestjs/common";
import { EventsService } from "./events.service";
import { CreateEventDto } from "./dto/create-event.dto";
import { RequestWithUser } from "../../core/auth/interfaces/request-with-user.interface";
import { JwtAuthGuard } from "../../core/auth/guards/jwt-auth.guard";
import { PaginationParams } from "../../shared/interfaces/pagination.interface";
import { SearchEventDto } from "./dto/search-event.dto";

@Controller('events')
export class EventsController {
    constructor(private readonly eventsService: EventsService){}

    @HttpCode(200)
    @Post()
    @UseGuards(JwtAuthGuard)
    async createEvent(@Body() event: CreateEventDto, @Req() req: RequestWithUser) {
        return this.eventsService.createEvent(event, req.user)
    }

    @Get()
    async getAllEvents(
        @Query() {category, startDate, endDate }: SearchEventDto,
        @Query() { offset, limit }: PaginationParams
    ) {
        return this.eventsService.getAllEvents(
            category,
            startDate,
            endDate,
            offset,
            limit
        )
    }
}