import { Repository } from 'typeorm';
import { RecipeImplRepository } from './recipe-impl.repository';
import { Recipe } from '../entities/recipe.entity';
import { ORDER_BY_DESC } from 'src/common/constants';

describe('RecipeImplRepository', () => {
  let repo: RecipeImplRepository;
  let typeOrmRepo: jest.Mocked<Repository<Recipe>>;

  beforeEach(() => {
    typeOrmRepo = {
      create: jest.fn(),
      save: jest.fn(),
      findAndCount: jest.fn(),
      findOne: jest.fn(),
    } as unknown as jest.Mocked<Repository<Recipe>>;

    repo = new RecipeImplRepository(typeOrmRepo);
  });

  describe('create', () => {
    it('deve chamar create do TypeORM com os dados e retornar o resultado', () => {
      const partialRecipe = { title: 'Teste' } as Partial<Recipe>;
      const createdRecipe = new Recipe();
      typeOrmRepo.create.mockReturnValue(createdRecipe);

      const result = repo.create(partialRecipe);

      expect(typeOrmRepo.create).toHaveBeenCalledWith(partialRecipe);
      expect(result).toBe(createdRecipe);
    });
  });

  describe('save', () => {
    it('deve chamar save do TypeORM e retornar o resultado', async () => {
      const recipe = new Recipe();
      const savedRecipe = { ...recipe, id: 1 };
      typeOrmRepo.save.mockResolvedValue(savedRecipe);

      const result = await repo.save(recipe);

      expect(typeOrmRepo.save).toHaveBeenCalledWith(recipe);
      expect(result).toBe(savedRecipe);
    });
  });

  describe('findPaginated', () => {
    it('deve chamar findAndCount com parâmetros padrão e retornar dados', async () => {
      const data = [new Recipe(), new Recipe()];
      const total = 2;
      typeOrmRepo.findAndCount.mockResolvedValue([data, total]);

      const result = await repo.findPaginated();

      expect(typeOrmRepo.findAndCount).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        relations: ['ingredients'],
        order: { id: ORDER_BY_DESC },
      });
      expect(result).toEqual({ data, total });
    });

    it('deve chamar findAndCount com parâmetros passados e retornar dados', async () => {
      const data = [new Recipe()];
      const total = 1;
      typeOrmRepo.findAndCount.mockResolvedValue([data, total]);

      const page = 2;
      const limit = 5;

      const result = await repo.findPaginated(page, limit);

      expect(typeOrmRepo.findAndCount).toHaveBeenCalledWith({
        skip: (page - 1) * limit,
        take: limit,
        relations: ['ingredients'],
        order: { id: ORDER_BY_DESC },
      });
      expect(result).toEqual({ data, total });
    });
  });

  describe('findById', () => {
    it('deve chamar findOne com parâmetros corretos e retornar receita', async () => {
      const recipe = new Recipe();
      typeOrmRepo.findOne.mockResolvedValue(recipe);

      const id = 123;
      const result = await repo.findById(id);

      expect(typeOrmRepo.findOne).toHaveBeenCalledWith({
        where: { id },
        relations: ['ingredients'],
      });
      expect(result).toBe(recipe);
    });

    it('deve retornar null se receita não for encontrada', async () => {
      typeOrmRepo.findOne.mockResolvedValue(null);

      const id = 999;
      const result = await repo.findById(id);

      expect(typeOrmRepo.findOne).toHaveBeenCalledWith({
        where: { id },
        relations: ['ingredients'],
      });
      expect(result).toBeNull();
    });
  });
});
