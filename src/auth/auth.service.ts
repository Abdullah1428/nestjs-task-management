import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredDto } from './dto/auth-cred.dto';

import { User } from './user.entity';
import { UsersRepo } from './users.repository';

import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(@InjectRepository(User) private usersRepository: UsersRepo) {}

  async signUp(authCredDto: AuthCredDto): Promise<void> {
    return this.usersRepository.createUser(authCredDto);
  }

  async signIn(authCredDto: AuthCredDto): Promise<string> {
    const { username, password } = authCredDto;
    const user = await this.usersRepository.findOne({
      where: {
        username: username,
      },
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      return 'success';
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }
}
