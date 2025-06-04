import {
  Injectable,
  Logger,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { CreateRecipeDto } from '../dtos/create-recipe.dto';
import { Recipe } from '../entities/recipe.entity';
import { RecipeRepository } from '../repositories/recipe.repository';
import { RecipeMapper } from '../mappers/recipe.mapper';
import { GetIngredientByNameUseCase } from 'src/domain/ingredient/use-cases/get-ingredient-by-name.usecase';
import { Ingredient } from 'src/domain/ingredient/entities/ingredient.entity';

@Injectable()
export class CreateRecipeUseCase {
  constructor(
    private readonly recipeRepository: RecipeRepository,
    private readonly getIngredientByNameUseCase: GetIngredientByNameUseCase,
  ) {}

  private readonly logger = new Logger(CreateRecipeUseCase.name);

  async execute(createRecipeDto: CreateRecipeDto): Promise<Recipe> {
    const ingredientNames = createRecipeDto.ingredients.map((i) =>
      i.name.toLowerCase(),
    );
    const hasDuplicates =
      new Set(ingredientNames).size !== ingredientNames.length;

    if (hasDuplicates) {
      throw new BadRequestException(
        'Duplicate ingredient names are not allowed.',
      );
    }

    const recipe = RecipeMapper.fromCreateDto(createRecipeDto);

    try {
      const ingredients: Ingredient[] = [];

      for (const ingredient of recipe.ingredients) {
        const existing = await this.getIngredientByNameUseCase.execute(
          ingredient.name,
        );

        if (existing) {
          ingredients.push(existing);
        } else {
          const newIngredient = new Ingredient();
          newIngredient.name = ingredient.name;
          ingredients.push(newIngredient);
        }
      }

      recipe.ingredients = ingredients;

      this.logger.log(`Saving recipe, data=${JSON.stringify(recipe)}`);

      return await this.recipeRepository.save(recipe);
    } catch (e) {
      const error = e as Error;
      this.logger.error(`Failed to save recipe: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to create recipe');
    }
  }
}
