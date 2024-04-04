import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserDto } from './dto/update-user';
import { CreateUserDto } from './dto/create-user';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
      },
    });
  }

  async findOneByEmail(email: string) {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('Could not find the user');
    }
    return user;
  }

  async store(data: CreateUserDto) {
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(data.password, salt);

    data.password = hashPassword;
    const user = this.usersRepository.create(data);

    return this.usersRepository.save(user);
  }

  async update(id: string, data: UpdateUserDto): Promise<User> {
    try {
      const user: User = new User();
      user.firstName = data.firstName;
      user.lastName = data.lastName;
      user.id = id;

      return await this.usersRepository.save(user);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('User not found.');
      } else {
        throw error;
      }
    }
  }

  async destroy(id: string) {
    try {
      return await this.usersRepository.delete(id);
    } catch (error) {
      throw new NotFoundException('User not found.');
    }
  }
}
