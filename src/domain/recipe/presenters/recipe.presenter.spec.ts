import { RecipePresenter } from './recipe.presenter';
import { Recipe } from '../entities/recipe.entity';
import { PaginatedResult } from '../../../common/types/paginated-result.type';

describe('RecipePresenter', () => {
  describe('toResponse', () => {
    it('deve retornar o formato correto da receita', () => {
      const recipe: Recipe = {
        id: 1,
        title: 'Torta de Limão',
        description: 'Com cobertura de merengue',
        ingredients: [
          { id: 1, name: 'limão', recipes: [] },
          { id: 2, name: 'leite condensado', recipes: [] },
        ],
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-02'),
      };

      const result = RecipePresenter.toResponse(recipe);

      expect(result).toEqual({
        id: recipe.id,
        title: recipe.title,
        ingredients: ['limão', 'leite condensado'],
        createdAt: recipe.createdAt,
      });
    });

    it('deve lidar com receita sem ingredientes', () => {
      const recipe: Recipe = {
        id: 2,
        title: 'Água quente',
        description: '',
        ingredients: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = RecipePresenter.toResponse(recipe);

      expect(result.ingredients).toEqual([]);
    });
  });

  describe('toResponseList', () => {
    it('deve retornar lista formatada com total', () => {
      const recipes: PaginatedResult<Recipe> = {
        data: [
          {
            id: 1,
            title: 'Café',
            description: 'Forte',
            ingredients: [{ id: 1, name: 'café', recipes: [] }],
            createdAt: new Date('2024-01-01'),
            updatedAt: new Date(),
          },
          {
            id: 2,
            title: 'Chá',
            description: 'Camomila',
            ingredients: [{ id: 2, name: 'camomila', recipes: [] }],
            createdAt: new Date('2024-01-02'),
            updatedAt: new Date(),
          },
        ],
        total: 2,
      };

      const result = RecipePresenter.toResponseList(recipes);

      expect(result).toEqual({
        data: [
          {
            id: 1,
            title: 'Café',
            ingredients: ['café'],
            createdAt: new Date('2024-01-01'),
          },
          {
            id: 2,
            title: 'Chá',
            ingredients: ['camomila'],
            createdAt: new Date('2024-01-02'),
          },
        ],
        total: 2,
      });
    });

    it('deve lidar com lista vazia', () => {
      const recipes: PaginatedResult<Recipe> = {
        data: [],
        total: 0,
      };

      const result = RecipePresenter.toResponseList(recipes);

      expect(result).toEqual({ data: [], total: 0 });
    });
  });
});
