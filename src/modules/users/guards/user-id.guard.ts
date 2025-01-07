import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class UserIdGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const userId = request.params.id;
    const currentUser = request.user;

    console.log(userId, currentUser.id);
    return userId == currentUser.id;
  }
}