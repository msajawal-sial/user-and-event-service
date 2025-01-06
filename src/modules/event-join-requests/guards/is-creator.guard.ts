import {
    CanActivate,
    ExecutionContext,
    Injectable,
  } from '@nestjs/common';
import { EventJoinRequestsService } from '../event-join-requests.service';
  
  @Injectable()
  export class IsCreatorGuard implements CanActivate {
    constructor(private readonly eventJoinRequestsService: EventJoinRequestsService) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      const user = request.user;
      const eventJoinRequestId = request.params.id;
      const eventJoinRequest = await this.eventJoinRequestsService.getEventJoinRequest(eventJoinRequestId);
      return eventJoinRequest && eventJoinRequest.event.creator.id == user.id
    }
  }