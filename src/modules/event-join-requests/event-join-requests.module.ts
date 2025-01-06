import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventJoinRequest } from './entities/event-join-request.entity';
import { EventJoinRequestsService } from './event-join-requests.service';
import { EventJoinRequestsController } from './event-join-requests.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { EmailModule } from 'src/core/messaging/email.module';

 
@Module({
  imports: [
    ConfigModule,
    EmailModule,
    TypeOrmModule.forFeature([EventJoinRequest])
  ],
  controllers: [EventJoinRequestsController],
  providers: [EventJoinRequestsService],
})
export class EventJoinRequestsModule {}