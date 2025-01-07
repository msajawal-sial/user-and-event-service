import { HttpException, HttpStatus, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { EventJoinRequest } from "./entities/event-join-request.entity";
import { CreateEventJoinRequestDto } from "./dto/create-event-join-request.dto";
import { notificationTemplates } from "../../shared/constants/notification-templates";
import { UpdateEventJoinRequestDto } from "./dto/update-event-join-request.dto";
import { EmailService } from "../../core/messaging/email.service";
import { PostgresErrorCode } from "src/core/database/postgres-error-codes.enum";

@Injectable()
export class EventJoinRequestsService {
    constructor(
        @InjectRepository(EventJoinRequest)
        private readonly eventJoinRequestsRepository: Repository<EventJoinRequest>,
        private readonly emailService: EmailService,
    ) {}

    async createEventJoinRequest(eventJoinRequest: CreateEventJoinRequestDto, userId: number): Promise<EventJoinRequest> {
        const newEventJoinRequest = this.eventJoinRequestsRepository.create({
            ...eventJoinRequest,
            userId: userId
        });
        try {
            await this.eventJoinRequestsRepository.save(newEventJoinRequest);
        } catch (error) {
            if (error?.code === PostgresErrorCode.UniqueViolation) {
                throw new HttpException('Event join request already exists', HttpStatus.BAD_REQUEST);
              }
              throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
        }
        
        const createdEventJoinRequest = await this.getEventJoinRequest(newEventJoinRequest.id)
        
        this.emailService.sendEmail(
            notificationTemplates.createEventJoinRequest,
            createdEventJoinRequest.event.creator.email,
            { user: createdEventJoinRequest.user.name, event: createdEventJoinRequest.event.title },
        )
    
        return newEventJoinRequest;
    }

    async updateEventJoinRequest(id: number, updateEventJoinRequest: UpdateEventJoinRequestDto): Promise<boolean> {    
        const result = await this.eventJoinRequestsRepository.update(id, updateEventJoinRequest);
    
        if (result.affected && result.affected > 0) {
            const updatedEventJoinRequest = await this.getEventJoinRequest(id);            
            // Send an email notification if the status has changed from "PENDING"
            if (updatedEventJoinRequest.status !== "PENDING") {
                this.emailService.sendEmail(
                    notificationTemplates.updateEventJoinRequest,
                    updatedEventJoinRequest.user.email,
                    { event: updatedEventJoinRequest.event.title, status: updatedEventJoinRequest.status }
                )
            }
            return true;
        }
    
        return false;
    }
    

    async getEventJoinRequest(id: number) {
        return await this.eventJoinRequestsRepository.findOne({ 
            where: { id },
            relations: ['user', 'event', 'event.creator'],
        });
    }
}