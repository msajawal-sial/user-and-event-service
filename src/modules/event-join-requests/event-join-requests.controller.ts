import { 
    Body,
    Controller,
    HttpCode,
    Param,
    Patch,
    Post,
    UseGuards
} from "@nestjs/common";
import { JwtAuthGuard } from "../../core/auth/guards/jwt-auth.guard";
import { EventJoinRequestsService } from "./event-join-requests.service";
import { CreateEventJoinRequestDto } from "./dto/create-event-join-request.dto";
import { UpdateEventJoinRequestDto } from "./dto/update-event-join-request.dto";
import { IsCreatorGuard } from "./guards/is-creator.guard";

@Controller('event-join-requests')
export class EventJoinRequestsController {
    constructor(private readonly eventJoinRequestsService: EventJoinRequestsService){}

    @HttpCode(200)
    @Post()
    @UseGuards(JwtAuthGuard)
    async createEventJoinRequest(@Body() eventJoinRequest: CreateEventJoinRequestDto) {
        return this.eventJoinRequestsService.createEventJoinRequest(eventJoinRequest)
    }

    @Patch(':id')
    @UseGuards(IsCreatorGuard)
    @UseGuards(JwtAuthGuard)
    async updateEventJoinRequest(@Param('id') id: number, @Body() updateEventJoinRequest: UpdateEventJoinRequestDto) {
        return this.eventJoinRequestsService.updateEventJoinRequest(id, updateEventJoinRequest)
    }
}