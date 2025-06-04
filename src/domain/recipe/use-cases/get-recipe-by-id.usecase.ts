import { Injectable, Logger, NotFoundException } from '@nestjs/common';

import { Recipe } from '../entities/recipe.entity';
import { RecipeRepository } from '../repositories/recipe.repository';

@Injectable()
export class GetRecipeByIdUseCase {
  constructor(private readonly recipeRepository: RecipeRepository) {}

  private readonly logger = new Logger(GetRecipeByIdUseCase.name);

  async execute(id: number): Promise<Recipe> {
    const recipe = await this.recipeRepository.findById(id);

    if (!recipe) {
      this.logger.error(
        `Recipe not found id=${id}, data=${JSON.stringify(recipe)}`,
      );
      throw new NotFoundException('Recipe not found');
    }

    this.logger.log(`Recipe id=${id}, data=${JSON.stringify(recipe)}`);

    return recipe;
  }
}
