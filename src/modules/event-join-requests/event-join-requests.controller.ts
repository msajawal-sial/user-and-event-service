import { 
    Body,
    Controller,
    HttpCode,
    Param,
    Patch,
    Post,
    Req,
    UseGuards
} from "@nestjs/common";
import { JwtAuthGuard } from "../../core/auth/guards/jwt-auth.guard";
import { EventJoinRequestsService } from "./event-join-requests.service";
import { CreateEventJoinRequestDto } from "./dto/create-event-join-request.dto";
import { UpdateEventJoinRequestDto } from "./dto/update-event-join-request.dto";
import { IsCreatorGuard } from "./guards/is-creator.guard";
import { RequestWithUser } from "src/core/auth/interfaces/request-with-user.interface";
import { EventJoinRequest } from "./entities/event-join-request.entity";
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';

@Controller('event-join-requests')
@ApiTags('event-join-requests')
export class EventJoinRequestsController {
    constructor(private readonly eventJoinRequestsService: EventJoinRequestsService){}

    @HttpCode(200)
    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Create a join request for an event' })
    @ApiBody({ type: CreateEventJoinRequestDto })
    @ApiResponse({ 
        status: 200, 
        description: 'Join request created successfully',
        type: EventJoinRequest
    })
    @ApiResponse({ status: 400, description: 'Bad Request - Join request already exists' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async createEventJoinRequest(
        @Body() eventJoinRequest: CreateEventJoinRequestDto, 
        @Req() req: RequestWithUser
    ): Promise<EventJoinRequest> {
        return this.eventJoinRequestsService.createEventJoinRequest(eventJoinRequest, req.user.id)
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, IsCreatorGuard)
    @ApiOperation({ summary: 'Update join request status (Accept/Reject)' })
    @ApiParam({ 
        name: 'id', 
        type: 'number', 
        description: 'Join request ID' 
    })
    @ApiBody({ type: UpdateEventJoinRequestDto })
    @ApiResponse({ 
        status: 200, 
        description: 'Join request updated successfully',
        type: Boolean
    })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Not the event creator' })
    async updateEventJoinRequest(
        @Param('id') id: number, 
        @Body() updateEventJoinRequest: UpdateEventJoinRequestDto
    ): Promise<boolean> {
        return this.eventJoinRequestsService.updateEventJoinRequest(id, updateEventJoinRequest)
    }
}