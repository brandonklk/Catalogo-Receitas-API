import { Recipe } from '../entities/recipe.entity';
import { CreateRecipeDto } from '../dtos/create-recipe.dto';
import { Ingredient } from '../entities/ingredient.entity';

export class RecipeMapper {
  static fromCreateDto(createRecipeDto: CreateRecipeDto): Recipe {
    const recipe = new Recipe();
    recipe.title = createRecipeDto.title;
    recipe.description = createRecipeDto.description;

    recipe.ingredients = createRecipeDto.ingredients.map((ingredient) => {
      const ingredientData = new Ingredient();

      ingredientData.name = ingredient.name;

      return ingredientData;
    });

    return recipe;
  }
}
