import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class SupermarketDto {

  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsNumber()
  readonly longitude: number;

  @IsNotEmpty()
  @IsNumber()
  readonly latitude: number;

  @IsNotEmpty()
  @IsString()
  readonly webPage: string;
}