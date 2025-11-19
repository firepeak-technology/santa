import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() body: { username: string; groupId: string }) {
    return this.usersService.create(body.username, body.groupId);
  }

  @Get('link/:link')
  async findByLink(@Param('link') link: string) {
    return this.usersService.findByLink(link);
  }
}
