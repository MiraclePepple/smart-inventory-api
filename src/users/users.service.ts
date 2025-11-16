import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  async create(dto: CreateUserDto) {
    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = this.usersRepo.create({
      ...dto,
      passwordHash,
    });

    return this.usersRepo.save(user);
  }

  findAll() {
    return this.usersRepo.find();
  }

  async findOne(id: string) {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByEmail(email: string) {
    return this.usersRepo.findOne({ where: { email } });
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.findOne(id);

    Object.assign(user, dto);
    return this.usersRepo.save(user);
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.usersRepo.delete(id);
  }
}
