import { Repository } from 'typeorm';
import { AuthCredDto } from './dto/auth-cred.dto';
import { User } from './user.entity';

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
    const user = this.create({
      username,
      password,
    });
    await this.save(user);
  },
};
