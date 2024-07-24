import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { hashPassword, isPasswordCorrect } from 'src/lib/utils';
import { Roles, UserDto } from 'src/users/dto/create-user-dto';
import { User } from 'src/users/schema/User.schema';
import { UsersService } from 'src/users/users.service';
import { CredentialsDTO } from './dto/credentials-dto';
import { Payload } from 'src/users/user';
import { JwtService } from '@nestjs/jwt';

type TokenPayload = {
  email: string;
  sub: {
    id: mongoose.Types.ObjectId;
    name: string;
    role: Roles;
  };
};

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private Users: Model<User | User[]>,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // ---- VALIDATE USER ---- //
  async validateUser(userInput: CredentialsDTO) {
    const { email, password } = userInput;
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    } else {
      const passwordMatch = await isPasswordCorrect(
        password,
        (user as User).password,
      );

      if (user && !passwordMatch)
        throw new BadRequestException('Invalid Credentials');
    }

    const credentials: Payload = {
      id: user._id,
      email,
      name: (user as User).name,
      role: (user as User).role,
    };

    return credentials;
  }

  // ---- LOGIN USER ---- //
  async loginUser(user: CredentialsDTO) {
    const retrievedUser = await this.validateUser(user);

    const payload: TokenPayload = {
      email: retrievedUser.email,
      sub: {
        id: retrievedUser.id,
        name: retrievedUser.name,
        role: retrievedUser.role,
      },
    };

    return {
      retrievedUser,
      access: {
        token: await this.jwtService.signAsync(payload, {
          expiresIn: '1h',
          secret: process.env.JWT_SECRET_KEY,
        }),
        refreshToken: await this.jwtService.signAsync(payload, {
          expiresIn: '7d',
          secret: process.env.JWT_REFRESH_TOKEN_KEY,
        }),
      },
    };
  }

  // ---- CREATE USER ---- //
  async createUser(user: UserDto) {
    const existingUser = await this.usersService.findByEmail(user.email);

    if (existingUser) throw new BadRequestException('Email already exists');

    const newUser = new this.Users({
      role: 'USER',
      ...user,
      password: await hashPassword(user.password),
    });

    newUser.save();

    return this.Users.findOne(newUser._id).select('-password');
  }
}
