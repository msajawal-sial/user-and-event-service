import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Event } from '../../events/entities/event.entity';
import { EventJoinRequest } from '../../event-join-requests/entities/event-join-request.entity';
import { ApiHideProperty } from '@nestjs/swagger';
 
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  public id?: number;
 
  @Column({ unique: true })
  public email: string;
 
  @Column()
  public name: string;
 
  @ApiHideProperty()
  @Exclude()
  @Column()
  public password: string;

  @ApiHideProperty()
  @OneToMany(() => Event, (event: Event) => event.creator)
  public events: Event

  @ApiHideProperty()
  @OneToMany(() => EventJoinRequest, (eventJoinRequest: EventJoinRequest) => eventJoinRequest.user)
  public eventJoinRequests: EventJoinRequest[]
}