import {
  IsString,
  IsArray,
  ArrayNotEmpty,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateIngredientDto } from './create-ingredient.dto';
import { ApiProperty } from '@nestjs/swagger';

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
