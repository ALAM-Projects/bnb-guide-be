import { IsDate, IsEmail, IsString } from 'class-validator';
import { Role } from '@generated/prisma/client';
import { Exclude } from 'class-transformer';

export class UserDto {
  @IsString()
  id: string;

  @IsEmail()
  email: string;

  @IsString()
  name: string | null;

  @IsString()
  surname: string | null;

  @IsString()
  role: Role;

  @IsString()
  planId: string | null;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;

  @Exclude()
  password: string;

  @Exclude()
  hashedRt: string;

  @Exclude()
  resetToken: string | null;

  @Exclude()
  resetTokenExpiresAt: Date | null;

  constructor(partial: Partial<UserDto>) {
    Object.assign(this, partial);
  }
}
