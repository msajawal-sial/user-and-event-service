import { ConfigService } from '@nestjs/config';
import { Transport, ClientProxyFactory } from '@nestjs/microservices';

export const getRabbitMQConfig = (configService: ConfigService) => {
  const user: string = configService.get('RABBITMQ_USER');
  const password: string = configService.get('RABBITMQ_PASSWORD'); 
  const host: string = configService.get('RABBITMQ_HOST');
  const queueName: string = configService.get('RABBITMQ_QUEUE_NAME');

  return ClientProxyFactory.create({
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://${user}:${password}@${host}`],
      queue: queueName,
      queueOptions: {
        durable: true
      },
    },
  });
};
