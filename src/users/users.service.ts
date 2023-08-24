import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';
import { SignupInput } from 'src/auth/dto/inputs/signup.input';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
import { UpdateUserInput } from './dto/update-user.input';
import { ItemsService } from '../items/items.service';

@Injectable()
export class UsersService {
  private logger = new Logger('UserService');

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(signupInput: SignupInput): Promise<User> {
    try {
      const newUser = this.usersRepository.create({
        ...signupInput,
        password: bcrypt.hashSync(signupInput.password, 10),
      });

      return await this.usersRepository.save(newUser);
    } catch (error) {
      this.handleErrors(error);
    }
  }

  async findAll(roles: ValidRoles[]): Promise<User[]> {
    if (roles.length === 0) return this.usersRepository.find();

    return this.usersRepository
      .createQueryBuilder()
      .andWhere('ARRAY[roles] && ARRAY[:...roles]')
      .setParameter('roles', roles)
      .getMany();
  }

  async findOneByEmail(email: string): Promise<User> {
    try {
      return await this.usersRepository.findOneByOrFail({ email });
    } catch (error) {
      this.handleErrors({
        error: 'error-001',
        detail: `${email} not found`,
      });
    }
  }

  async findOneById(id: string): Promise<User> {
    try {
      return await this.usersRepository.findOneByOrFail({ id });
    } catch (error) {
      this.handleErrors({
        error: 'error-001',
        detail: `${id} not found`,
      });
    }
  }

  async update(
    id: string,
    updateUserInput: UpdateUserInput,
    userReq: User,
  ): Promise<User> {
    try {
      const user = await this.usersRepository.preload({
        ...updateUserInput,
        id,
      });
      user.lastUpdateBy = userReq;

      return this.usersRepository.save(user);
    } catch (error) {
      this.handleErrors(error);
    }
  }

  async block(id: string, user: User): Promise<User> {
    const userToBlock = await this.findOneById(id);
    userToBlock.isActive = false;
    userToBlock.lastUpdateBy = user;
    return this.usersRepository.save(userToBlock);
  }

  private handleErrors(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail.replace('Key ', ''));
    }
    if (error.code === 'error-001') {
      console.log('entrooooo');
      throw new BadRequestException(error.detail.replace('Key ', ''));
    }
    this.logger.error(error);
    throw new InternalServerErrorException('Please check server logs');
  }
}
