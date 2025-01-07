import {
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    Index,
    OneToMany,
  } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { EventJoinRequest } from '../../event-join-requests/entities/event-join-request.entity';
import { Exclude } from 'class-transformer';
import { ApiHideProperty } from '@nestjs/swagger';

@Entity()
 export class Event {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public title: string;

    @Column()
    public description: string;

    @Index("event_category_index")
    @Column()
    public category: string;

    @Column({ type: 'timestamp' })
    public date: Date

    @ApiHideProperty()
    @Exclude()
    @ManyToOne(() => User, (creator: User) => creator.events)
    public creator: User

    @ApiHideProperty()
    @Exclude()
    @OneToMany(() => EventJoinRequest, (eventJoinRequest: EventJoinRequest) => eventJoinRequest.event)
    public joinRequests: EventJoinRequest[]
}