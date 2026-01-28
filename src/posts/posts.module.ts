import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostTranslationsController } from './post-translations.controller';
import { PostsService } from './posts.service';

@Module({
  controllers: [PostsController, PostTranslationsController],
  providers: [PostsService]
})
export class PostsModule { }
