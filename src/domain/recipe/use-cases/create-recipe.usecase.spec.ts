import { Test, TestingModule } from '@nestjs/testing';
import { CreateRecipeUseCase } from './create-recipe.usecase';
import { RecipeRepository } from '../repositories/recipe.repository';
import { IngredientRepository } from '../repositories/ingredient.repository';
import { CreateRecipeDto } from '../dtos/create-recipe.dto';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Ingredient } from '../entities/ingredient.entity';

const mockRecipeRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
});

const mockIngredientRepository = () => ({
  findByName: jest.fn(),
});

describe('CreateRecipeUseCase', () => {
  let useCase: CreateRecipeUseCase;
  let recipeRepo: ReturnType<typeof mockRecipeRepository>;
  let ingredientRepo: ReturnType<typeof mockIngredientRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateRecipeUseCase,
        { provide: RecipeRepository, useFactory: mockRecipeRepository },
        { provide: IngredientRepository, useFactory: mockIngredientRepository },
      ],
    }).compile();

    useCase = module.get<CreateRecipeUseCase>(CreateRecipeUseCase);
    recipeRepo = module.get(RecipeRepository);
    ingredientRepo = module.get(IngredientRepository);
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
    recipeRepo.create.mockImplementation((data) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return data;
    });
    recipeRepo.save.mockResolvedValue({
      id: 1,
      ...dto,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    ingredientRepo.findByName.mockResolvedValue(null);

    const result = await useCase.execute(dto);

    expect(recipeRepo.save).toHaveBeenCalled();
    expect(result.title).toBe(dto.title);
    expect(result.ingredients.length).toBe(dto.ingredients.length);
  });

  it('should reuse existing ingredients if found', async () => {
    const dto = createDto();
    const existingIngredient = new Ingredient();
    existingIngredient.name = 'Salt';

    ingredientRepo.findByName.mockImplementation((name: string) =>
      name.toLowerCase() === 'salt' ? existingIngredient : null,
    );

    recipeRepo.create.mockImplementation((data) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return data;
    });
    recipeRepo.save.mockResolvedValue({
      id: 1,
      ...dto,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await useCase.execute(dto);

    expect(result.ingredients.find((i) => i.name === 'Salt')).toEqual(
      existingIngredient,
    );
  });

  it('should throw InternalServerErrorException if saving fails', async () => {
    const dto = createDto();
    recipeRepo.create.mockImplementation((data) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return data;
    });
    recipeRepo.save.mockRejectedValue(new Error('DB Error'));

    ingredientRepo.findByName.mockResolvedValue(null);

    await expect(useCase.execute(dto)).rejects.toThrow(
      InternalServerErrorException,
    );
  });
});
