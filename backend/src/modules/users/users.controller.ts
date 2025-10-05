import { Body, Controller, Get, Param, ParseIntPipe, Post, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LogWeightDto } from './dto/log-weight.dto';
import { SetGoalDto } from './dto/set-goal.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Patch(':id/profile')
  updateProfile(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProfileDto) {
    return this.usersService.upsertProfile(id, dto);
  }

  @Post(':id/goal')
  setGoal(@Param('id', ParseIntPipe) id: number, @Body() dto: SetGoalDto) {
    return this.usersService.setGoal(id, dto);
  }

  @Post(':id/weight')
  logWeight(@Param('id', ParseIntPipe) id: number, @Body() dto: LogWeightDto) {
    return this.usersService.logWeight(id, dto);
  }

  @Get(':id/metrics/latest')
  latest(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.latestMetrics(id);
  }
}
