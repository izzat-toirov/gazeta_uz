import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { CategoriesModule } from './categories/categories.module';
import { TagsModule } from './tags/tags.module';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { MediaModule } from './media/media.module';
import { CommentsModule } from './comments/comments.module';
import { ReactionsModule } from './reactions/reactions.module';
import { AuthModule } from './auth/auth.module';
import { FilesModule } from './files/files.module';
import { SupabaseModule } from './supabase/supabase.module';
import { StatsModule } from './stats/stats.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    PrismaModule,
    CategoriesModule,
    TagsModule,
    UsersModule,
    PostsModule,
    MediaModule,
    CommentsModule,
    ReactionsModule,
    FilesModule,
    SupabaseModule,
    StatsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
