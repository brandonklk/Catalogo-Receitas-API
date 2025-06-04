import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Ingredient } from '../entities/ingredient.entity';
import { IngredientRepository } from './ingredient.repository';

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
