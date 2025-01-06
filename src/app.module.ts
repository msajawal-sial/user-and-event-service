import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import { DatabaseModule } from './core/database/database.module';
import { AuthenticationModule } from './core/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { EventsModule } from './modules/events/events.module';
import { EventJoinRequestsModule } from './modules/event-join-requests/event-join-requests.module';
import { EmailModule } from './core/messaging/email.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        PORT: Joi.number(),
        RABBITMQ_USER: Joi.string().required(),
        RABBITMQ_PASSWORD: Joi.string().required(),
        RABBITMQ_HOST: Joi.string().required(),
        RABBITMQ_QUEUE_NAME: Joi.string().required()
      })
    }),
    AuthenticationModule,
    DatabaseModule,
    EmailModule,
    UsersModule,
    EventsModule,
    EventJoinRequestsModule
    ],
  controllers: [],
  providers: [],
})
export class AppModule {}
