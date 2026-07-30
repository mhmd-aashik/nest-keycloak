import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './db/db.module';
import { PassportModule } from '@nestjs/passport';
import { TodosModule } from './todos/todos.module';
import { KeycloakStrategy } from './auth/keycloak.strategy';

@Module({
  imports: [
    DbModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TodosModule,
  ],
  controllers: [AppController],
  providers: [AppService, KeycloakStrategy],
})
export class AppModule {}
