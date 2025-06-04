import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recipe } from './entities/recipe.entity';
import { RecipeImplRepository } from './repositories/recipe-impl.repository';
import { RecipeRepository } from './repositories/recipe.repository';
import { RecipeController } from './controllers/recipe.controller';
import { CreateRecipeUseCase } from './use-cases/create-recipe.usecase';
import { GetRecipeByIdUseCase } from './use-cases/get-recipe-by-id.usecase';
import { ListAllRecipesUseCase } from './use-cases/list-all-recipes.usecase';
import { IngredientModule } from '../ingredient/ingredient.module';

@Module({
  imports: [TypeOrmModule.forFeature([Recipe]), IngredientModule],
  controllers: [RecipeController],
  providers: [
    {
      provide: RecipeRepository,
      useClass: RecipeImplRepository,
    },
    CreateRecipeUseCase,
    GetRecipeByIdUseCase,
    ListAllRecipesUseCase,
  ],
})
export class RecipeModule {}
