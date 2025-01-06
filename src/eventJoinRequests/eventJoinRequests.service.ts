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
        
        const res = await this.eventJoinRequestsRepository.findOne({
            where: { id: newEventJoinRequest.id },
            relations: ['user', 'event', 'event.creator'],
        })
        
        this.emailsService
        .emit(
            { cmd: 'send-email' }, 
            {
                templateId: notificationTemplates.createEventJoinRequest,
                recipient: res.event.creator.email,
                metadata: { user: res.user.name, event: res.event.title },
            }
        )
        return newEventJoinRequest;
    }

    async updateEventJoinRequest(id: number, updateEventJoinRequest: UpdateEventJoinRequestDto) {
        const eventJoinRequest = await this.eventJoinRequestsRepository.findOne({ 
            where: { id },
            relations: ['user', 'event'], // Load necessary relations for processing
        });
    
        if (!eventJoinRequest) {
            throw new NotFoundException(`EventJoinRequest with ID ${id} not found`);
        }
    
        Object.assign(eventJoinRequest, updateEventJoinRequest);
    
        const updatedEventJoinRequest = await this.eventJoinRequestsRepository.save(eventJoinRequest);
    
        // Fetch the saved entity without relations to mimic the behavior of no `relations` in `findOne`
        const result = await this.eventJoinRequestsRepository.findOne({ where: { id } });
    
        // Emit an email notification if the status changes from "PENDING"
        if (updatedEventJoinRequest.status !== "PENDING") {
            this.emailsService.emit(
                { cmd: 'send-email' }, 
                {
                    templateId: notificationTemplates.updateEventJoinRequest,
                    recipient: eventJoinRequest.user.email,
                    metadata: { event: eventJoinRequest.event.title, status: updatedEventJoinRequest.status },
                }
            );
        }
    
        return result;
    }

}