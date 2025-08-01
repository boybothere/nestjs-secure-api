import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostModule } from './post/post.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './post/entities/post.entity';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/entities/user.entity';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [PostModule,
    // Rate limiting setup - max 10 requests per 60 seconds
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 10,
        }
      ]
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // In-memory caching
    CacheModule.register({
      isGlobal: true,
      ttl: 30000,
      max: 100,
    }),
    // PostgreSQL connection using TypeORM        
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: process.env.DB_PASSWORD,
      database: 'sm_nestjs_db',
      entities: [Post, User],
      synchronize: true
    }), AuthModule // Handles login, registration, and user management
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
