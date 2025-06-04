import {
  IsString,
  IsArray,
  ArrayNotEmpty,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateIngredientDto } from 'src/domain/ingredient/dtos/create-ingredient.dto';

export class CreateRecipeDto {
  @ApiProperty({ example: 'Bolo de chocolate' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Bolo de chocolate com morango' })
  @IsString()
  description: string;

  @ApiProperty({ type: [CreateIngredientDto] })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateIngredientDto)
  ingredients: CreateIngredientDto[];
}
