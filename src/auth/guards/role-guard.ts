import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesAuthorized } from '../decorators/roles.decorator';
import { Request } from 'express';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const allowedRole = this.reflector.get(
      RolesAuthorized,
      context.getHandler(),
    );

    const request: Request = await context.switchToHttp().getRequest();
    const userRole = request.user.sub.role;

    if (!userRole || userRole !== allowedRole)
      throw new UnauthorizedException(`${allowedRole} privilege required`);

    return true;
  }
}
