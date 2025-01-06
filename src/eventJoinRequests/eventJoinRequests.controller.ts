import { 
    Body,
    Controller,
    Get,
    HttpCode,
    Param,
    Patch,
    Post,
    Query,
    Req,
    UseGuards
} from "@nestjs/common";
import RequestWithUser from "../authentication/requestWithUser.interface";
import { JwtAuthGuard } from "src/authentication/jwtAuthentication.guard";
import { PaginationParams } from "../utils/types/paginationParams";
import EventJoinRequestsService from "./eventJoinRequests.service";
import { CreateEventJoinRequestDto } from "./dto/createEventJoinRequest.dto";
import UpdateEventJoinRequestDto from "./dto/updateEventJoinRequest.dto";

@Controller('event-join-requests')
export default class EventJoinRequestsController {
    constructor(private readonly eventJoinRequestsService: EventJoinRequestsService){}

    @HttpCode(200)
    @Post()
    @UseGuards(JwtAuthGuard)
    async createEventJoinRequest(@Body() eventJoinRequest: CreateEventJoinRequestDto) {
        return this.eventJoinRequestsService.createEventJoinRequest(eventJoinRequest)
    }

    @Patch(':id')
    async updateEventJoinRequest(@Param('id') id: number, @Body() updateEventJoinRequest: UpdateEventJoinRequestDto) {
        return this.eventJoinRequestsService.updateEventJoinRequest(id, updateEventJoinRequest)
    }
}