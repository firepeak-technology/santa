import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(username: string, groupId: string): Promise<User> {
    const uniqueLink = uuidv4();
    const user = this.usersRepository.create({
      username,
      uniqueLink,
      group: { id: groupId },
    });
    return this.usersRepository.save(user);
  }

  async findByLink(link: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { uniqueLink: link },
      relations: ['group', 'drawnUser', 'wishlist', 'drawnUser.wishlist'],
    });
    
    if (!user) {
      throw new NotFoundException('Gebruiker niet gevonden');
    }
    
    return user;
  }

  async getUserWithDrawn(userId: string): Promise<User> {
    return this.usersRepository.findOne({
      where: { id: userId },
      relations: ['drawnUser', 'drawnUser.wishlist'],
    });
  }
}
