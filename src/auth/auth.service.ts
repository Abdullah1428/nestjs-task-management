import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredDto } from './dto/auth-cred.dto';

import { User } from './user.entity';
import { UsersRepo } from './users.repository';

@Injectable()
export class AuthService {
  constructor(@InjectRepository(User) private usersRepository: UsersRepo) {}

  signUp(authCredDto: AuthCredDto): Promise<void> {
    return this.usersRepository.createUser(authCredDto);
  }
}
