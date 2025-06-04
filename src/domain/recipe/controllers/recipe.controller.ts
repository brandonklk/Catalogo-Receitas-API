import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { CreateRecipeDto } from '../dtos/create-recipe.dto';
import { CreateRecipeUseCase } from '../use-cases/create-recipe.usecase';
import { ListAllRecipesUseCase } from '../use-cases/list-all-recipes.usecase';
import { GetRecipeByIdUseCase } from '../use-cases/get-recipe-by-id.usecase';
import { PaginationQueryDto } from '../../../common/dtos/pagination-query.dto';
import { RecipePresenter } from '../presenters/recipe.presenter';

@Controller('recipes')
export class RecipeController {
  constructor(
    private readonly createRecipe: CreateRecipeUseCase,
    private readonly listAll: ListAllRecipesUseCase,
    private readonly getById: GetRecipeByIdUseCase,
  ) {}

  private readonly logger = new Logger(RecipeController.name);

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createRecipeDto: CreateRecipeDto) {
    this.logger.log(
      `create new recipe, data=${JSON.stringify(createRecipeDto)}`,
    );

    const recipesCreated = await this.createRecipe.execute(createRecipeDto);

    return {
      message: 'Receita criada com sucesso.',
      statusCode: HttpStatus.CREATED,
      data: RecipePresenter.toResponse(recipesCreated),
    };
  }

  @Get()
  async findPaginated(@Query() pagination: PaginationQueryDto) {
    const recipes = await this.listAll.execute(pagination);
    return RecipePresenter.toResponseList(recipes);
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    this.logger.log(`get recipe, id=${id}`);
    const recipe = await this.getById.execute(id);
    return RecipePresenter.toResponse(recipe);
  }
}
