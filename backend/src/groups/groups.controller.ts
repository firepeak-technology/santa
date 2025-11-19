import {Controller, Get, Post, Body, Param, UseGuards} from '@nestjs/common';
import { GroupsService } from './groups.service';
import {AuthGuard} from "@nestjs/passport";
import {AdminGuard} from "../auth/admin.guard";

@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async create(@Body() body: { name: string, budget:number }) {
    return this.groupsService.create(body.name, body.budget);
  }

  @Post(':id/draw')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async drawLots(@Param('id') id: string) {
    await this.groupsService.drawLots(id);
    return { message: 'Lootjes succesvol getrokken!' };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.groupsService.findOne(id);
  }
  @Get('')
  async list( ) {
    return this.groupsService.list();
  }
}
