import { IsNotEmpty, IsString , IsNumber} from 'class-validator';

export class city_dto {

  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly country: string;

  @IsNotEmpty()
  @IsNumber()
  readonly numberInhabitants: number;
}