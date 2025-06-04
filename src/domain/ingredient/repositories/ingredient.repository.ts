import { Ingredient } from '../entities/ingredient.entity';

export abstract class IngredientRepository {
  abstract findByName(name: string): Promise<Ingredient | null>;
}
