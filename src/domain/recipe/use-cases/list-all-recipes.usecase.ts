import { Injectable, Logger } from '@nestjs/common';
import { RecipeRepository } from '../repositories/recipe.repository';
import { PaginationQueryDto } from '../../../common/dtos/pagination-query.dto';

@Injectable()
export class ListAllRecipesUseCase {
  constructor(private readonly recipeRepository: RecipeRepository) {}

  private readonly logger = new Logger(ListAllRecipesUseCase.name);

  async execute(pagination: PaginationQueryDto) {
    const { page, limit } = pagination;

    const data = await this.recipeRepository.findPaginated(page, limit);

    this.logger.log(
      `Get recipes, quantity=${data.data.length}, total=${data.total}, pagination=${JSON.stringify(pagination)}`,
    );

    return data;
  }
}
