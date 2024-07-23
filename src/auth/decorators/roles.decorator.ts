import { Reflector } from '@nestjs/core';
import { Roles } from 'src/users/dto/create-user-dto';

export const RolesAuthorized = Reflector.createDecorator<Roles>();
