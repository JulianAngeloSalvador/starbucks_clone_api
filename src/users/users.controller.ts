import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt-guard';
import { Roles, UserDto } from './dto/create-user-dto';
import { UsersService } from './users.service';
import { RolesGuard } from 'src/auth/guards/role-guard';
import { RolesAuthorized } from 'src/auth/decorators/roles.decorator';
import mongoose from 'mongoose';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtGuard, RolesGuard)
  @RolesAuthorized('ADMIN')
  @Get()
  async findAll(@Query('role') role?: Roles): Promise<UserDto[]> {
    return await this.usersService.findAll(role);
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async findUser(@Param('id') id: string): Promise<UserDto> {
    return await this.usersService.findUser(id);
  }
}
