import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { getRabbitMQConfig } from "../../config/rabbitmq.config";
import { EmailService } from './email.service';

@Module({
    imports: [ConfigModule],
    providers: [
      {
        provide: 'EMAIL_CLIENT',
        useFactory: getRabbitMQConfig,
        inject: [ConfigService],
     },
     EmailService
  ],
  exports: [EmailService]
})
export class EmailModule {}