import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  Get,
  Param,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateTodoDto } from './dto/update-todo.dto';

interface RequestWithUser extends Request {
  user: {
    userId: string;
  };
}

@UseGuards(JwtAuthGuard)
@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  create(@Req() req: RequestWithUser, @Body() dto: CreateTodoDto) {
    return this.todosService.create(req.user?.userId, dto);
  }

  @Get()
  findAll(@Req() req: RequestWithUser) {
    return this.todosService.findAll(req.user?.userId);
  }

  @Get(':id')
  findOne(@Req() req: RequestWithUser, @Param('id', ParseIntPipe) id: number) {
    return this.todosService.findOne(req.user.userId, id);
  }

  @Patch(':id')
  update(
    @Req() req: RequestWithUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTodoDto,
  ) {
    return this.todosService.update(req.user.userId, id, dto);
  }
}
