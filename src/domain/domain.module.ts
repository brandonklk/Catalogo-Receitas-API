import { Module } from '@nestjs/common';
import { RecipeModule } from './recipe/recipe.module';

@Module({
  imports: [RecipeModule],
  exports: [RecipeModule],
  controllers: [],
  providers: [],
})
export class DomainModule {}
