import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { GroupsModule } from './groups/groups.module';
import { WishlistsModule } from './wishlists/wishlists.module';
import {AuthModule} from "./auth/auth.module";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'postgres',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER || 'kerstlootjes',
      password: process.env.DB_PASSWORD || 'kerstlootjes',
      database: process.env.DB_NAME || 'kerstlootjes',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    UsersModule,
    GroupsModule,
    WishlistsModule,
    AuthModule,
  ],
})
export class AppModule {}
