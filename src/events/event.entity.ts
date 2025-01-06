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
import User from '../users/user.entity';
import EventJoinRequest from '../eventJoinRequests/eventJoinRequest.entity';

@Entity()
  class Event {
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

export default Event;