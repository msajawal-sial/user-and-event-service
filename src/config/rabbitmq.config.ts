import { ConfigService } from '@nestjs/config';
import { Transport, ClientProxyFactory } from '@nestjs/microservices';

export const getRabbitMQConfig = (configService: ConfigService) => ({
  transport: Transport.RMQ,
  options: {
    urls: ['amqp://guest:guest@rabbitmq:5672'],
    queue: 'email_queue',
    queueOptions: {
      durable: true
    },
  },
});
