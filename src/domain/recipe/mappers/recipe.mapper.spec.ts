import { RecipeMapper } from './recipe.mapper';
import { CreateRecipeDto } from '../dtos/create-recipe.dto';
import { Recipe } from '../entities/recipe.entity';
import { Ingredient } from 'src/domain/ingredient/entities/ingredient.entity';

describe('RecipeMapper', () => {
  describe('fromCreateDto', () => {
    it('deve mapear corretamente o DTO para a entidade Recipe com ingredientes', () => {
      const dto: CreateRecipeDto = {
        title: 'Pão de Queijo',
        description: 'Tradicional mineiro',
        ingredients: [{ name: 'polvilho' }, { name: 'queijo' }],
      };

      const result = RecipeMapper.fromCreateDto(dto);

      expect(result).toBeInstanceOf(Recipe);
      expect(result.title).toBe(dto.title);
      expect(result.description).toBe(dto.description);
      expect(result.ingredients).toHaveLength(dto.ingredients.length);
      result.ingredients.forEach((ingredient, index) => {
        expect(ingredient).toBeInstanceOf(Ingredient);
        expect(ingredient.name).toBe(dto.ingredients[index].name);
      });
    });

    it('deve lidar com ingredientes vazios', () => {
      const dto: CreateRecipeDto = {
        title: 'Água',
        description: '',
        ingredients: [],
      };

      const result = RecipeMapper.fromCreateDto(dto);

      expect(result).toBeInstanceOf(Recipe);
      expect(result.ingredients).toEqual([]);
    });
  });
});
