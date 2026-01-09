import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Email non valida' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'La password deve contenere almeno 6 caratteri' })
  password: string;
}

export class SignupDto extends LoginDto {
  @IsString()
  name: string;

  @IsString()
  surname: string;
}
