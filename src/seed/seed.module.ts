import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ItemsModule } from 'src/items/items.module';
import { UsersModule } from 'src/users/users.module';

import { SeedService } from './seed.service';
import { SeedResolver } from './seed.resolver';



@Module({
  providers: [SeedResolver, SeedService],
  imports: [ 
    ConfigModule,
    UsersModule,
    ItemsModule
   ]
})
export class SeedModule {}
