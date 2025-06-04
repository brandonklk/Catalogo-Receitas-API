import { Recipe } from '../entities/recipe.entity';
import { PaginatedResult } from '../../../common/types/paginated-result.type';

export class RecipePresenter {
  static toResponse(recipe: Recipe) {
    return {
      id: recipe.id,
      title: recipe.title,
      ingredients: recipe.ingredients.map((i) => i.name),
      createdAt: recipe.createdAt,
    };
  }

  static toResponseList(recipes: PaginatedResult<Recipe>) {
    const data = recipes.data.map((recipe) => this.toResponse(recipe));

    return {
      data,
      total: recipes.total,
    };
  }
}
