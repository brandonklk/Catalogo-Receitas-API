import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ingredient } from './entities/ingredient.entity';
import { IngredientRepository } from './repositories/ingredient.repository';
import { IngredientImplRepository } from './repositories/ingredient-impl.repository';
import { GetIngredientByNameUseCase } from './use-cases/get-ingredient-by-name.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([Ingredient])],
  controllers: [],
  providers: [
    {
      provide: IngredientRepository,
      useClass: IngredientImplRepository,
    },
    GetIngredientByNameUseCase,
  ],
  exports: [GetIngredientByNameUseCase],
})
export class IngredientModule {}
