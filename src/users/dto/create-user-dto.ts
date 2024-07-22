import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export type Roles = 'ADMIN' | 'USER';

export class UserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsEnum(['USER', 'ADMIN'], {
    message: 'User role must be USER or ADMIN only',
  })
  role: Roles;
}
