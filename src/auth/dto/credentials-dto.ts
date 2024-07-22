import { IsEmail, IsNotEmpty } from 'class-validator';

export class CredentialsDTO {
  @IsNotEmpty({ message: 'Please provide email' })
  @IsEmail()
  email: string;

  @IsNotEmpty({ message: 'Please enter password' })
  password: string;
}
