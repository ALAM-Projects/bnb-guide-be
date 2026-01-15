import { Injectable } from '@nestjs/common';
import { UserRepository } from '@/modules/user/user.repository';

@Injectable()
export class DBManager {
  constructor(public readonly users: UserRepository) {}
}
