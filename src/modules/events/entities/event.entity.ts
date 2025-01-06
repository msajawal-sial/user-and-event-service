import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
    Index,
    OneToMany,
    RelationId,
    CreateDateColumn,
  } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { EventJoinRequest } from '../../event-join-requests/entities/event-join-request.entity';

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

    @ManyToOne(() => User, (creator: User) => creator.events)
    public creator: User

    @OneToMany(() => EventJoinRequest, (eventJoinRequest: EventJoinRequest) => eventJoinRequest.event)
    public joinRequests: EventJoinRequest[]
}