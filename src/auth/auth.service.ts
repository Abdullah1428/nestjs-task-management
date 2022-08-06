import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from './user.entity';
import { UsersRepo } from './users.repository';

@Injectable()
export class AuthService {
  constructor(@InjectRepository(User) private usersRepository: UsersRepo) {}
}
