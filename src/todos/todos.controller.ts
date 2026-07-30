import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

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
}
