import { ListAllRecipesUseCase } from './list-all-recipes.usecase';
import { RecipeRepository } from '../repositories/recipe.repository';
import { PaginationQueryDto } from '../../../common/dtos/pagination-query.dto';
import { Recipe } from '../entities/recipe.entity';

describe('ListAllRecipesUseCase', () => {
  let useCase: ListAllRecipesUseCase;
  let recipeRepository: jest.Mocked<RecipeRepository>;

  beforeEach(() => {
    recipeRepository = {
      findPaginated: jest.fn(),
    } as unknown as jest.Mocked<RecipeRepository>;

    useCase = new ListAllRecipesUseCase(recipeRepository);
  });

  it('deve retornar receitas paginadas com sucesso', async () => {
    const pagination: PaginationQueryDto = { page: 1, limit: 10 };

    const mockRecipes: Recipe[] = [
      {
        id: 1,
        title: 'Bolo de Fubá',
        description: 'Com goiabada',
        ingredients: [{ id: 1, name: 'fubá', recipes: [] }],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        title: 'Pão de Queijo',
        description: 'Mineiro',
        ingredients: [{ id: 2, name: 'polvilho', recipes: [] }],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const paginatedResult = {
      data: mockRecipes,
      total: 2,
    };

    recipeRepository.findPaginated.mockResolvedValue(paginatedResult);

    const result = await useCase.execute(pagination);

    expect(recipeRepository.findPaginated).toHaveBeenCalledWith(1, 10);
    expect(result).toEqual(paginatedResult);
  });

  it('deve retornar vazio corretamente quando não houver receitas', async () => {
    const pagination: PaginationQueryDto = { page: 1, limit: 10 };

    const paginatedResult = {
      data: [],
      total: 0,
    };

    recipeRepository.findPaginated.mockResolvedValue(paginatedResult);

    const result = await useCase.execute(pagination);

    expect(recipeRepository.findPaginated).toHaveBeenCalledWith(1, 10);
    expect(result).toEqual(paginatedResult);
  });

  it('deve lançar erro se findPaginated falhar', async () => {
    const pagination: PaginationQueryDto = { page: 1, limit: 10 };

    recipeRepository.findPaginated.mockRejectedValue(new Error('DB failure'));

    await expect(useCase.execute(pagination)).rejects.toThrow('DB failure');
    expect(recipeRepository.findPaginated).toHaveBeenCalledWith(1, 10);
  });
});
