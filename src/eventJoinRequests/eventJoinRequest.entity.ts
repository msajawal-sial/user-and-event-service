import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import User from '../users/user.entity'
import Event from '../events/event.entity'

@Entity('event_join_requests')
@Unique(["userId", "eventId"])
class EventJoinRequest {
    @PrimaryGeneratedColumn()
    public id: number;

    @JoinColumn({ name: 'userId'} )
    @ManyToOne(() => User, (user: User) => user.eventJoinRequests)
    public user: User;
    
    @Column()
    public userId: number;

    @JoinColumn({ name: 'eventId' })
    @ManyToOne(() => Event, (event: Event) => event.joinRequests)
    public event: Event;

    @Column()
    public eventId: number;

    @Column({ default: 'PENDING' })
    status?: 'PENDING' | 'ACCEPTED' | 'REJECTED';
}

export default EventJoinRequest;