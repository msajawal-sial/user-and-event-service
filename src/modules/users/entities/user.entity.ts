import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Event } from '../../events/entities/event.entity';
import { EventJoinRequest } from '../../event-join-requests/entities/event-join-request.entity';
 
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  public id?: number;
 
  @Column({ unique: true })
  public email: string;
 
  @Column()
  public name: string;
 
  @Exclude()
  @Column()
  public password: string;

  @OneToMany(() => Event, (event: Event) => event.creator)
  public events: Event

  @OneToMany(() => EventJoinRequest, (eventJoinRequest: EventJoinRequest) => eventJoinRequest.user)
  public eventJoinRequests: EventJoinRequest[]
}