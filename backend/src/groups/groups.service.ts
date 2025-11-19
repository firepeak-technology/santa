import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from './group.entity';
import { User } from '../users/user.entity';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private groupsRepository: Repository<Group>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(name: string): Promise<Group> {
    const group = this.groupsRepository.create({ name });
    return this.groupsRepository.save(group);
  }

  async drawLots(groupId: string): Promise<void> {
    const group = await this.groupsRepository.findOne({
      where: { id: groupId },
      relations: ['users'],
    });

    if (!group) {
      throw new BadRequestException('Groep niet gevonden');
    }

    if (group.drawn) {
      throw new BadRequestException('Lootjes al getrokken voor deze groep');
    }

    if (group.users.length < 2) {
      throw new BadRequestException('Minimaal 2 gebruikers nodig');
    }

    // Shuffle gebruikers
    const users = [...group.users];
    const shuffled = this.shuffle(users);

    // Wijs elk persoon aan de volgende toe (circulair)
    for (let i = 0; i < shuffled.length; i++) {
      const currentUser = shuffled[i];
      const drawnUser = shuffled[(i + 1) % shuffled.length];
      
      currentUser.drawnUser = drawnUser;
      await this.usersRepository.save(currentUser);
    }

    group.drawn = true;
    await this.groupsRepository.save(group);
  }

  private shuffle<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  async findOne(id: string): Promise<Group> {
    return this.groupsRepository.findOne({
      where: { id },
      relations: ['users'],
    });
  }
  async list(): Promise<Group[]> {
    return this.groupsRepository.find();
  }
}
