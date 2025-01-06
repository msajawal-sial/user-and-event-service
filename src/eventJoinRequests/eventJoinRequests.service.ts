import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, FindOptionsWhere, Between, MoreThanOrEqual, LessThanOrEqual } from "typeorm";
import User from '../users/user.entity';
import EventJoinRequest from "./eventJoinRequest.entity";
import { CreateEventJoinRequestDto } from "./dto/createEventJoinRequest.dto";
import { ClientProxy } from "@nestjs/microservices";
import { notificationTemplates } from "./constants";
import UpdateEventJoinRequestDto from "./dto/updateEventJoinRequest.dto";

@Injectable()
export default class EventJoinRequestsService {
    constructor(
        @InjectRepository(EventJoinRequest)
        private readonly eventJoinRequestsRepository: Repository<EventJoinRequest>,
        @Inject('EMAIL_SERVICE') private readonly emailsService: ClientProxy,
    ) {}

    async createEventJoinRequest(eventJoinRequest: CreateEventJoinRequestDto) {
        const newEventJoinRequest = this.eventJoinRequestsRepository.create({
            ...eventJoinRequest,
        });
        await this.eventJoinRequestsRepository.save(newEventJoinRequest);
        
        const cratedEventJoinRequest = await this.getEventJoinRequest(newEventJoinRequest.id)
        
        this.emailsService
        .emit(
            { cmd: 'send-email' }, 
            {
                templateId: notificationTemplates.createEventJoinRequest,
                recipient: cratedEventJoinRequest.event.creator.email,
                metadata: { user: cratedEventJoinRequest.user.name, event: cratedEventJoinRequest.event.title },
            }
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
                this.emailsService.emit(
                    { cmd: 'send-email' }, 
                    {
                        templateId: notificationTemplates.updateEventJoinRequest,
                        recipient: updatedEventJoinRequest.user.email,
                        metadata: { 
                            event: updatedEventJoinRequest.event.title, 
                            status: updatedEventJoinRequest.status 
                        },
                    }
                );
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