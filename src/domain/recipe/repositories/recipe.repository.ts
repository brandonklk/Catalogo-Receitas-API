import { Recipe } from '../entities/recipe.entity';
import { PaginatedResult } from '../../../common/types/paginated-result.type';

export abstract class RecipeRepository {
  abstract create(data: Partial<Recipe>): Recipe;
  abstract save(recipe: Recipe): Promise<Recipe>;
  abstract findPaginated(
    page?: number,
    limit?: number,
  ): Promise<PaginatedResult<Recipe>>;
  abstract findById(id: number): Promise<Recipe | null>;
}
