import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schema/User.schema';
import { Roles, UserDto } from './dto/create-user-dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private Users: Model<User | User[]>) {}

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
}
