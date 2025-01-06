import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import EventJoinRequest from './eventJoinRequest.entity';
import EventJoinRequestsService from './eventJoinRequests.service';
import EventJoinRequestsController from './eventJoinRequests.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

 
@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([EventJoinRequest])
  ],
  controllers: [EventJoinRequestsController],
  providers: [
    EventJoinRequestsService,
    {
        provide: 'EMAIL_SERVICE',
        useFactory: (configService: ConfigService) => {
          const user = configService.get('RABBITMQ_USER');
          const password = configService.get('RABBITMQ_PASSWORD');
          const host = configService.get('RABBITMQ_HOST');
          const queueName = configService.get('RABBITMQ_QUEUE_NAME');
   
          return ClientProxyFactory.create({
            transport: Transport.RMQ,
            options: {
              urls: [`amqp://${user}:${password}@${host}`],
              queue: queueName,
              queueOptions: {
                durable: true,
              },
            },
          })
        },
        inject: [ConfigService],
      }
],
})
export class EventJoinRequestsModule {}