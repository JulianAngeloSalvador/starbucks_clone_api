import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schema/User.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private Users: Model<User | User[]>) {}

  // ---- Find by Email ---- //
  async findByEmail(email: string) {
    return await this.Users.findOne({ email });
  }
}
