import { CityEntity } from '../city/city.entity';
import { CitySupermarketService } from './city-supermarket.service';
import { Module } from '@nestjs/common';
import { SupermarketEntity } from '../supermarket/supermarket.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CitySupermarketController } from './city-supermarket.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CityEntity, SupermarketEntity])],
  providers: [CitySupermarketService],
  controllers: [CitySupermarketController]
})
export class CitySupermarketModule { }