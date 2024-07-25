import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schema/User.schema';
import { Roles, UserDto } from './dto/create-user-dto';
import { accessibility, validateObjectId } from 'src/lib/utils';
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

  // ---- Find a User ---- //

  async findUser(requestedId: string): Promise<UserDto | null> {
    const isValidId = await validateObjectId(requestedId);

    if (!isValidId)
      throw new BadRequestException('Please enter a valid user ID');

    const userToFind =
      await this.Users.findById(requestedId).select('-password');
    const requester = this.request.user.sub;

    if (!userToFind) throw new NotFoundException('User not found');

    const accessLevel = await accessibility(requestedId, requester);
    if (accessLevel === 0)
      throw new UnauthorizedException('Action not allowed. Id not matched.');

    if (accessLevel === 1) {
      const filteredInfo = await this.Users.findById(requestedId).select(
        '-password -_id -role',
      );
      return filteredInfo as UserDto;
    }
    return userToFind as UserDto;
  }
}
