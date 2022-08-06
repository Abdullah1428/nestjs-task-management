import { Repository } from 'typeorm';
import { User } from './user.entity';

export interface UsersRepo extends Repository<User> {
  this: Repository<User>;
  createUser(): number;
}

export const UsersRepository: Pick<UsersRepo, 'createUser'> = {
  createUser(this: Repository<User>) {
    return 1;
  },
};
