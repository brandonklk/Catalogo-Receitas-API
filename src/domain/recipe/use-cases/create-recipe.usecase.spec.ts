import { Test, TestingModule } from '@nestjs/testing';
import { CreateRecipeUseCase } from './create-recipe.usecase';
import { RecipeRepository } from '../repositories/recipe.repository';
import { GetIngredientByNameUseCase } from 'src/domain/ingredient/use-cases/get-ingredient-by-name.usecase';
import { CreateRecipeDto } from '../dtos/create-recipe.dto';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Ingredient } from 'src/domain/ingredient/entities/ingredient.entity';

const mockRecipeRepository = () => ({
  save: jest.fn(),
});

const mockGetIngredientByNameUseCase = () => ({
  execute: jest.fn(),
});

describe('CreateRecipeUseCase', () => {
  let useCase: CreateRecipeUseCase;
  let recipeRepo: ReturnType<typeof mockRecipeRepository>;
  let getIngredientByNameUseCase: ReturnType<
    typeof mockGetIngredientByNameUseCase
  >;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateRecipeUseCase,
        { provide: RecipeRepository, useFactory: mockRecipeRepository },
        {
          provide: GetIngredientByNameUseCase,
          useFactory: mockGetIngredientByNameUseCase,
        },
      ],
    }).compile();

    useCase = module.get<CreateRecipeUseCase>(CreateRecipeUseCase);
    recipeRepo = module.get(RecipeRepository);
    getIngredientByNameUseCase = module.get(GetIngredientByNameUseCase);
  });

  const createDto = (): CreateRecipeDto => ({
    title: 'Test Recipe',
    description: 'Test Description',
    ingredients: [{ name: 'Salt' }, { name: 'Sugar' }],
  });

  it('should throw BadRequestException if duplicate ingredients are provided', async () => {
    const dto = createDto();
    dto.ingredients.push({ name: 'salt' });

    await expect(useCase.execute(dto)).rejects.toThrow(BadRequestException);
  });

  it('should create a recipe with new ingredients', async () => {
    const dto = createDto();

    getIngredientByNameUseCase.execute.mockResolvedValue(null);
    recipeRepo.save.mockResolvedValue({
      id: 1,
      ...dto,
      createdAt: new Date(),
      updatedAt: new Date(),
      ingredients: dto.ingredients.map((ingredient, index) => ({
        id: index + 1,
        name: ingredient.name,
      })),
    });

    const result = await useCase.execute(dto);

    expect(getIngredientByNameUseCase.execute).toHaveBeenCalledTimes(
      dto.ingredients.length,
    );
    for (const ingredient of dto.ingredients) {
      expect(getIngredientByNameUseCase.execute).toHaveBeenCalledWith(
        ingredient.name,
      );
    }

    expect(recipeRepo.save).toHaveBeenCalled();
    expect(result.title).toBe(dto.title);
    expect(result.ingredients.length).toBe(dto.ingredients.length);
  });

  it('should reuse existing ingredients if found', async () => {
    const dto = createDto();
    const saltIngredient = 'Salt';

    const existingIngredient = new Ingredient();
    existingIngredient.name = saltIngredient;
    existingIngredient.id = 1;

    getIngredientByNameUseCase.execute.mockImplementation((name: string) =>
      name.toLowerCase() === saltIngredient.toLowerCase()
        ? existingIngredient
        : null,
    );

    recipeRepo.save.mockResolvedValue({
      id: 1,
      ...dto,
      createdAt: new Date(),
      updatedAt: new Date(),
      ingredients: dto.ingredients.map((ingredient, index) => ({
        id: index + 1,
        name: ingredient.name,
      })),
    });

    const result = await useCase.execute(dto);

    expect(result.ingredients.find((i) => i.name === saltIngredient)).toEqual(
      existingIngredient,
    );
  });

  it('should throw InternalServerErrorException if saving fails', async () => {
    const dto = createDto();

    getIngredientByNameUseCase.execute.mockResolvedValue(null);
    recipeRepo.save.mockRejectedValue(new Error('DB Error'));

    await expect(useCase.execute(dto)).rejects.toThrow(
      InternalServerErrorException,
    );
  });
});
