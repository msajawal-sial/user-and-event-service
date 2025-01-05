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
import EventsService from "./events.service";
import CreateEventDto from "./dto/createEvent.dto";
import RequestWithUser from "../authentication/requestWithUser.interface";
import { JwtAuthGuard } from "src/authentication/jwtAuthentication.guard";
import { PaginationParams } from "../utils/types/paginationParams";
import SearchEventDto from "./dto/searchEvent.dto";
import { Strategy } from "passport-local";

@Controller('events')
export default class EventsController {
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