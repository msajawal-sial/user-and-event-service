import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class EmailService {
  constructor(
    @Inject('EMAIL_CLIENT') private readonly emailClient: ClientProxy,
  ) {}

  async sendEmail(templateId: string, recipient: string, metadata: any) {
    return this.emailClient.emit(
      { cmd: 'send-email' },
      {
        templateId,
        recipient,
        metadata,
      },
    );
  }
}
