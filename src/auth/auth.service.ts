import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { AuthCredDto } from './dto/auth-cred.dto';
import { User } from './user.entity';
import { UsersRepo } from './users.repository';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepository: UsersRepo,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredDto: AuthCredDto): Promise<void> {
    return this.usersRepository.createUser(authCredDto);
  }

  async signIn(authCredDto: AuthCredDto): Promise<{ accessToken: string }> {
    const { username, password } = authCredDto;
    const user = await this.usersRepository.findOne({
      where: {
        username: username,
      },
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { username };
      const accessToken: string = await this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }
}
