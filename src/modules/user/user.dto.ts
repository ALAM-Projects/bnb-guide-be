import { IsEmail, IsString, MinLength } from 'class-validator';

export class UserDto {
  @IsString()
  name?: string;

  // @IsString()
  // surname?: string;

  // @IsString()
  // @IsEmail({}, { message: 'Email non valida' })
  // email?: string;

  // @IsString()
  // @MinLength(6, { message: 'La password deve contenere almeno 6 caratteri' })
  // password?: string;
}
