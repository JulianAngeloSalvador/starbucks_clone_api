import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from 'src/users/dto/create-user-dto';
import { CredentialsDTO } from './dto/credentials-dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body(ValidationPipe) user: UserDto) {
    return this.authService.createUser(user);
  }

  @Post('login')
  async login(@Body(ValidationPipe) user: CredentialsDTO) {
    return this.authService.loginUser(user);
  }
}
