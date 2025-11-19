import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wishlist } from './wishlist.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistsRepository: Repository<Wishlist>,
  ) {}

  async create(userId: string, item: string, description?: string, link?: string): Promise<Wishlist> {
    const wishlist = this.wishlistsRepository.create({
      item,
      description,
      link,
      user: { id: userId },
    });
    return this.wishlistsRepository.save(wishlist);
  }

  async findByUser(userId: string): Promise<Wishlist[]> {
    return this.wishlistsRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  async delete(id: string): Promise<void> {
    await this.wishlistsRepository.delete(id);
  }
}
