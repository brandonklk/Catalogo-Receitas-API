import { Test, TestingModule } from '@nestjs/testing';
import { RecipeController } from './recipe.controller';
import { CreateRecipeUseCase } from '../use-cases/create-recipe.usecase';
import { ListAllRecipesUseCase } from '../use-cases/list-all-recipes.usecase';
import { GetRecipeByIdUseCase } from '../use-cases/get-recipe-by-id.usecase';
import { RecipePresenter } from '../presenters/recipe.presenter';
import { PaginationQueryDto } from '../../../common/dtos/pagination-query.dto';
import { HttpStatus, NotFoundException } from '@nestjs/common';
import { Recipe } from '../entities/recipe.entity';

describe('RecipeController', () => {
  let controller: RecipeController;
  let createRecipeUseCase: CreateRecipeUseCase;
  let listAllRecipesUseCase: ListAllRecipesUseCase;
  let getRecipeByIdUseCase: GetRecipeByIdUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecipeController],
      providers: [
        {
          provide: CreateRecipeUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: ListAllRecipesUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: GetRecipeByIdUseCase,
          useValue: { execute: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<RecipeController>(RecipeController);
    createRecipeUseCase = module.get<CreateRecipeUseCase>(CreateRecipeUseCase);
    listAllRecipesUseCase = module.get<ListAllRecipesUseCase>(
      ListAllRecipesUseCase,
    );
    getRecipeByIdUseCase =
      module.get<GetRecipeByIdUseCase>(GetRecipeByIdUseCase);
  });

  describe('create', () => {
    it('deve chamar CreateRecipeUseCase e retornar a receita criada', async () => {
      const dto = {
        title: 'Bolo',
        description: 'Delicioso',
        ingredients: [{ name: 'ovo' }],
      };

      const recipe: Recipe = {
        id: 1,
        ...dto,
        ingredients: [{ id: 1, name: 'ovo', recipes: [] }],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (createRecipeUseCase.execute as jest.Mock).mockResolvedValue(recipe);

      const expectedResponse = {
        message: 'Receita criada com sucesso.',
        statusCode: HttpStatus.CREATED,
        data: RecipePresenter.toResponse(recipe),
      };

      const response = await controller.create(dto);

      expect(createRecipeUseCase.execute).toHaveBeenCalledWith(dto);
      expect(response).toEqual(expectedResponse);
    });
  });

  describe('findPaginated', () => {
    it('deve chamar ListAllRecipesUseCase e retornar lista paginada formatada', async () => {
      const pagination: PaginationQueryDto = { page: 1, limit: 10 };
      const paginatedData: any = {
        total: 2,
        data: [
          {
            id: 1,
            title: 'Bolo',
            ingredients: ['ovo'],
            createdAt: new Date(),
          },
          {
            id: 2,
            title: 'Torta',
            ingredients: ['farinha'],
            createdAt: new Date(),
          },
        ],
      };

      (listAllRecipesUseCase.execute as jest.Mock).mockResolvedValue(
        paginatedData,
      );

      const response = await controller.findPaginated(pagination);

      expect(listAllRecipesUseCase.execute).toHaveBeenCalledWith(pagination);
      expect(response).toEqual(RecipePresenter.toResponseList(paginatedData));
    });
  });

  describe('findById', () => {
    it('deve chamar GetRecipeByIdUseCase e retornar receita formatada', async () => {
      const id = 1;
      const recipe: any = {
        id,
        title: 'Bolo',
        ingredients: [{ name: 'ovo' }],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (getRecipeByIdUseCase.execute as jest.Mock).mockResolvedValue(recipe);

      const response = await controller.findById(id);

      expect(getRecipeByIdUseCase.execute).toHaveBeenCalledWith(id);
      expect(response).toEqual(RecipePresenter.toResponse(recipe));
    });

    it('deve propagar NotFoundException do use-case', async () => {
      const id = 999;
      (getRecipeByIdUseCase.execute as jest.Mock).mockRejectedValue(
        new NotFoundException(),
      );

      await expect(controller.findById(id)).rejects.toThrow(NotFoundException);

      expect(getRecipeByIdUseCase.execute).toHaveBeenCalledWith(id);
    });
  });
});
