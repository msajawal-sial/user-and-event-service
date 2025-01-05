import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import Event from "./event.entity";
import { Repository, FindOptionsWhere, Between, MoreThanOrEqual, LessThanOrEqual } from "typeorm";
import CreateEventDto from "./dto/createEvent.dto";
import User from '../users/user.entity';

@Injectable()
export default class EventsService {
    constructor(
        @InjectRepository(Event)
        private readonly eventsRepository: Repository<Event>,
    ) {}


    async createEvent(event: CreateEventDto, user: User) {
        const newEvent = await this.eventsRepository.create({
            ...event,
            creator: user
        });

        await this.eventsRepository.save(newEvent);
        return newEvent;
    }

    async getAllEvents(
        category?: string,
        startDate?: Date,
        endDate?: Date,
        offset?: number,
        limit?: number
    ) {

        const whereConditions: FindOptionsWhere<Event> = {
            ...(category && { category }),
            ...(startDate && endDate && { date: Between(startDate, endDate) }),
            ...(startDate && !endDate && { date: MoreThanOrEqual(startDate) }),
            ...(endDate && !startDate && { date: LessThanOrEqual(endDate) }),
        };

        const [items, count] = await this.eventsRepository.findAndCount({
            where: whereConditions,
            order: {
                id: 'ASC'
            },
            skip: offset,
            take: limit
        });

        return {
            items,
            count
        }
    }
}