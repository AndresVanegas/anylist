import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { ItemsModule } from 'src/items/items.module';
import { ListsModule } from 'src/lists/lists.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), ItemsModule, ListsModule],
  providers: [UsersResolver, UsersService],
  exports: [
    UsersService,
    TypeOrmModule],
})
export class UsersModule {}
