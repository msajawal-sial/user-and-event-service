import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { EventJoinRequest } from "./entities/event-join-request.entity";
import { CreateEventJoinRequestDto } from "./dto/create-event-join-request.dto";
import { notificationTemplates } from "../../shared/constants/notification-templates";
import { UpdateEventJoinRequestDto } from "./dto/update-event-join-request.dto";
import { EmailService } from "../../core/messaging/email.service";

@Injectable()
export class EventJoinRequestsService {
    constructor(
        @InjectRepository(EventJoinRequest)
        private readonly eventJoinRequestsRepository: Repository<EventJoinRequest>,
        private readonly emailService: EmailService,
    ) {}

    async createEventJoinRequest(eventJoinRequest: CreateEventJoinRequestDto) {
        const newEventJoinRequest = this.eventJoinRequestsRepository.create({
            ...eventJoinRequest,
        });
        await this.eventJoinRequestsRepository.save(newEventJoinRequest);
        
        const cratedEventJoinRequest = await this.getEventJoinRequest(newEventJoinRequest.id)
        
        this.emailService.sendEmail(
            notificationTemplates.createEventJoinRequest,
            cratedEventJoinRequest.event.creator.email,
            { user: cratedEventJoinRequest.user.name, event: cratedEventJoinRequest.event.title },
        )
    
        return newEventJoinRequest;
    }

    async updateEventJoinRequest(id: number, updateEventJoinRequest: UpdateEventJoinRequestDto): Promise<boolean> {    
        const result = await this.eventJoinRequestsRepository.update(id, updateEventJoinRequest);
    
        if (result.affected && result.affected > 0) {
            // Fetch the updated entity
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