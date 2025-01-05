import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import Event from '../events/event.entity'
 
@Entity()
class User {
  @PrimaryGeneratedColumn()
  public id?: number;
 
  @Column({ unique: true })
  public email: string;
 
  @Column()
  public name: string;
 
  @Column()
  public password: string;

  @OneToMany(() => Event, (event: Event) => event.creator)
  public events: Event
}
 
export default User;