import { Inject, Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DRIZZLE } from 'src/db/db.module';
import * as schema from '../db/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class TodosService {
  constructor(
    @Inject(DRIZZLE)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async create(ownerId: string, dto: CreateTodoDto) {
    const [todo] = await this.db
      .insert(schema.todos)
      .values({ ownerId, title: dto.title, done: dto.done ?? false })
      .returning();
    return todo;
  }

  async findAll(ownerId: string) {
    return this.db
      .select()
      .from(schema.todos)
      .where(eq(schema.todos.ownerId, ownerId));
  }
}
