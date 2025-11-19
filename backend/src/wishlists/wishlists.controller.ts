import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { WishlistsService } from './wishlists.service';

@Controller('wishlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Post()
  async create(@Body() body: { userId: string; item: string; description?: string; link?: string }) {
    return this.wishlistsService.create(body.userId, body.item, body.description, body.link);
  }

  @Get('user/:userId')
  async findByUser(@Param('userId') userId: string) {
    return this.wishlistsService.findByUser(userId);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.wishlistsService.delete(id);
    return { message: 'Item verwijderd' };
  }
}
