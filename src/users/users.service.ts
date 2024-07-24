import {
  BadRequestException,
  ExecutionContext,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schema/User.schema';
import { Roles, UserDto } from './dto/create-user-dto';
import { validateObjectId } from 'src/lib/utils';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private Users: Model<User | User[]>,
    @Inject(REQUEST) private request: Request,
  ) {}

  // ---- Find by Email ---- //
  async findByEmail(email: string) {
    return await this.Users.findOne({ email });
  }

  // ---- Find All ---- //

  async findAll(role?: Roles): Promise<UserDto[]> {
    if (role && !['ADMIN', 'USER'].includes(role))
      throw new NotFoundException('Role not found');

    const filter = role ? { role } : {};
    return await this.Users.find(filter).select('-password');
  }

  async findUser(requestedId: string): Promise<UserDto | null> {
    const isValidId = await validateObjectId(requestedId);

    if (!isValidId)
      throw new BadRequestException('Please enter a valid user ID');

    const userToFind =
      await this.Users.findById(requestedId).select('-password');
    const requester = this.request.user;

    if (!userToFind) throw new NotFoundException('User not found');

    if (requestedId !== requester.sub.id) {
      if (requester.sub.role !== 'ADMIN')
        throw new UnauthorizedException(
          'Users info not accessible; Action not allowed',
        );
    }

    return userToFind as UserDto;
  }
}
