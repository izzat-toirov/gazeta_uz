import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoryTranslationsController } from './category-translations.controller';
import { CategoriesService } from './categories.service';

@Module({
  controllers: [CategoriesController, CategoryTranslationsController],
  providers: [CategoriesService]
})
export class CategoriesModule { }
