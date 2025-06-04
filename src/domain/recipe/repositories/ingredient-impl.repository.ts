import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IngredientRepository } from './ingredient.repository';
import { Ingredient } from '../entities/ingredient.entity';

@Injectable()
export class IngredientImplRepository implements IngredientRepository {
  constructor(
    @InjectRepository(Ingredient)
    private readonly ingredientRepository: Repository<Ingredient>,
  ) {}

  findByName(name: string): Promise<Ingredient | null> {
    return this.ingredientRepository.findOne({ where: { name } });
  }
}
