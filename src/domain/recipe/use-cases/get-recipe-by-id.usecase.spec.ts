import { GetRecipeByIdUseCase } from './get-recipe-by-id.usecase';
import { RecipeRepository } from '../repositories/recipe.repository';
import { NotFoundException } from '@nestjs/common';
import { Recipe } from '../entities/recipe.entity';

describe('GetRecipeByIdUseCase', () => {
  let useCase: GetRecipeByIdUseCase;
  let recipeRepository: jest.Mocked<RecipeRepository>;

  beforeEach(() => {
    recipeRepository = {
      findById: jest.fn(),
    } as unknown as jest.Mocked<RecipeRepository>;

    useCase = new GetRecipeByIdUseCase(recipeRepository);
  });

  it('deve retornar a receita quando ela existir', async () => {
    const mockRecipe: Recipe = {
      id: 1,
      title: 'Bolo de Cenoura',
      description: 'Com cobertura de chocolate',
      ingredients: [
        { id: 1, name: 'cenoura', recipes: [] },
        { id: 2, name: 'ovo', recipes: [] },
        { id: 3, name: 'farinha', recipes: [] },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    recipeRepository.findById.mockResolvedValue(mockRecipe);

    const result = await useCase.execute(1);

    expect(recipeRepository.findById).toHaveBeenCalledWith(1);
    expect(result).toEqual(mockRecipe);
  });

  it('deve lançar NotFoundException quando a receita não existir', async () => {
    recipeRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(99)).rejects.toThrow(NotFoundException);
    expect(recipeRepository.findById).toHaveBeenCalledWith(99);
  });
});
