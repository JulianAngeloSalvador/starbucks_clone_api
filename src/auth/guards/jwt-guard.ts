import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JsonWebTokenError, JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  private extractToken(req: Request) {
    const authorization = req.headers.authorization;

    if (!authorization) throw new BadRequestException('Payload Token Required');

    const [type, token] = authorization.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);

    if (!token) throw new UnauthorizedException('User Privilege Required');

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET_KEY,
      });
      request['user'] = payload;
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        const message = error.message || 'Invalid Token';
        throw new UnauthorizedException(message);
      } else {
        throw new InternalServerErrorException(
          'Unexpected error during token verification',
        );
      }
    }
    return true;
  }
}
