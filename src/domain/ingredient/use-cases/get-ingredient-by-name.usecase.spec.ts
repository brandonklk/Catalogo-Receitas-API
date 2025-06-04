import { Test, TestingModule } from '@nestjs/testing';
import { GetIngredientByNameUseCase } from './get-ingredient-by-name.usecase';
import { IngredientRepository } from '../repositories/ingredient.repository';
import { Ingredient } from '../entities/ingredient.entity';

describe('GetIngredientByNameUseCase', () => {
  let useCase: GetIngredientByNameUseCase;
  let ingredientRepository: IngredientRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetIngredientByNameUseCase,
        {
          provide: IngredientRepository,
          useValue: {
            findByName: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<GetIngredientByNameUseCase>(
      GetIngredientByNameUseCase,
    );
    ingredientRepository =
      module.get<IngredientRepository>(IngredientRepository);
  });

  it('should return an ingredient if found', async () => {
    const name = 'tomato';
    const ingredient = new Ingredient();
    ingredient.id = 1;
    ingredient.name = name;

    jest
      .spyOn(ingredientRepository, 'findByName')
      .mockResolvedValue(ingredient);

    const result = await useCase.execute(name);

    expect(ingredientRepository.findByName).toHaveBeenCalledWith(name);
    expect(result).toEqual(ingredient);
  });

  it('should return null if ingredient is not found', async () => {
    const name = 'nonexistent';

    jest.spyOn(ingredientRepository, 'findByName').mockResolvedValue(null);

    const result = await useCase.execute(name);

    expect(ingredientRepository.findByName).toHaveBeenCalledWith(name);
    expect(result).toBeNull();
  });

  it('should log the correct message', async () => {
    const name = 'carrot';
    const ingredient = new Ingredient();
    ingredient.id = 2;
    ingredient.name = name;

    jest
      .spyOn(ingredientRepository, 'findByName')
      .mockResolvedValue(ingredient);

    // Spy on logger.log
    const loggerSpy = jest.spyOn(useCase['logger'], 'log');

    await useCase.execute(name);

    expect(loggerSpy).toHaveBeenCalledWith(
      `Ingredient name=${name}, data=${JSON.stringify(ingredient)}`,
    );
  });

  it('should propagate errors thrown by repository', async () => {
    const name = 'error';

    jest
      .spyOn(ingredientRepository, 'findByName')
      .mockRejectedValue(new Error('DB failure'));

    await expect(useCase.execute(name)).rejects.toThrow('DB failure');

    expect(ingredientRepository.findByName).toHaveBeenCalledWith(name);
  });
});
