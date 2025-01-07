import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Event } from '../../events/entities/event.entity';
import { Exclude } from 'class-transformer';
import { ApiHideProperty } from '@nestjs/swagger';

@Entity('event_join_requests')
@Unique(['userId', 'eventId'])
export class EventJoinRequest {
  @PrimaryGeneratedColumn()
  public id: number;

  @ApiHideProperty()
  @Exclude()
  @JoinColumn({ name: 'userId' })
  @ManyToOne(() => User, (user: User) => user.eventJoinRequests)
  public user: User;

  @Column()
  public userId: number;

  @ApiHideProperty()
  @Exclude()
  @JoinColumn({ name: 'eventId' })
  @ManyToOne(() => Event, (event: Event) => event.joinRequests)
  public event: Event;

  @Column()
  public eventId: number;

  @Column({ default: 'PENDING' })
  status?: 'PENDING' | 'ACCEPTED' | 'REJECTED';
}

export default EventJoinRequest;
