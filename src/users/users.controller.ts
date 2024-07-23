import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt-guard';
import { Roles, UserDto } from './dto/create-user-dto';
import { UsersService } from './users.service';
import { RolesGuard } from 'src/auth/guards/role-guard';
import { RolesAuthorized } from 'src/auth/decorators/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtGuard, RolesGuard)
  @RolesAuthorized('ADMIN')
  @Get()
  async findAll(@Query('role') role?: Roles): Promise<UserDto[]> {
    return await this.usersService.findAll(role);
  }
}
