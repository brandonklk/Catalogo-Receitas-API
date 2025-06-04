import { Injectable, Logger } from '@nestjs/common';
import { IngredientRepository } from '../repositories/ingredient.repository';
import { Ingredient } from '../entities/ingredient.entity';

@Injectable()
export class GetIngredientByNameUseCase {
  constructor(private readonly ingredientRepository: IngredientRepository) {}

  private readonly logger = new Logger(GetIngredientByNameUseCase.name);

  async execute(name: string): Promise<Ingredient | null> {
    const ingredient = await this.ingredientRepository.findByName(name);

    this.logger.log(
      `Ingredient name=${name}, data=${JSON.stringify(ingredient)}`,
    );

    return ingredient;
  }
}
