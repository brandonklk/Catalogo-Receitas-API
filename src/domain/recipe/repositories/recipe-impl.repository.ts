import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecipeRepository } from './recipe.repository';
import { Recipe } from '../entities/recipe.entity';
import { ORDER_BY_DESC } from 'src/common/constants';
import { PaginatedResult } from '../../../common/types/paginated-result.type';

@Injectable()
export class RecipeImplRepository implements RecipeRepository {
  constructor(
    @InjectRepository(Recipe)
    private readonly recipeRepository: Repository<Recipe>,
  ) {}

  create(data: Partial<Recipe>): Recipe {
    return this.recipeRepository.create(data);
  }

  save(recipe: Recipe): Promise<Recipe> {
    return this.recipeRepository.save(recipe);
  }

  async findPaginated(page = 1, limit = 10): Promise<PaginatedResult<Recipe>> {
    const [data, total] = await this.recipeRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      relations: ['ingredients'],
      order: { id: ORDER_BY_DESC },
    });

    return { data, total };
  }

  findById(id: number): Promise<Recipe | null> {
    return this.recipeRepository.findOne({
      where: { id },
      relations: ['ingredients'],
    });
  }
}
