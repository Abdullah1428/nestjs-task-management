import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { AuthCredDto } from './dto/auth-cred.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

export interface UsersRepo extends Repository<User> {
  this: Repository<User>;
  createUser(authCredDto: AuthCredDto): Promise<void>;
}

export const UsersRepository: Pick<UsersRepo, 'createUser'> = {
  async createUser(
    this: Repository<User>,
    authCredDto: AuthCredDto,
  ): Promise<void> {
    const { username, password } = authCredDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.create({
      username,
      password: hashedPassword,
    });

    try {
      await this.save(user);
    } catch (error) {
      // 23505 error code for duplicates
      // for production level you will handle this in service
      if (error.code === '23505') {
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  },
};
