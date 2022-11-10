import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { CitySupermarketService } from './city-supermarket.service';
import { plainToInstance } from 'class-transformer';
import { SupermarketDto } from '../supermarket/supermarket.dto';
import { SupermarketEntity } from '../supermarket/supermarket.entity';

@Controller('cities')
@UseInterceptors(BusinessErrorsInterceptor)
export class CitySupermarketController {

  /**
  * Crea instancia citySupermarketService.
  */
  constructor(private readonly citySupermarketService: CitySupermarketService) { }

  /**
  * Asocia un supermercado a una ciudad.
  * @param cityId
  * @param supermarketId
  * @returns CityEntity
  */
  @Post(':cityId/supermarkets/:supermarketId')
  async addSupermarketToCity(@Param('cityId') cityId: string, @Param('supermarketId') supermarketId: string) {
    return await this.citySupermarketService.addSupermarketToCity(cityId, supermarketId);
  }

  /**
  * Obtiene los supermercados que tiene una ciudad.
  * @param cityId
  * @returns SupermarketEntity[]
  */
  @Get(':cityId/supermarkets')
  async findSupermarketsFromCity(@Param('cityId') cityId: string) {
    return await this.citySupermarketService.findSupermarketsFromCity(cityId);
  }

  /**
  * Obtiene un supermercado de una ciudad.
  * @param cityId
  * @param supermarketId
  * @returns SupermarketEntity
  */
  @Get(':cityId/supermarkets/:supermarketId')
  async findSupermarketFromCity(@Param('cityId') cityId: string, @Param('supermarketId') supermarketId: string) {
    return await this.citySupermarketService.findSupermarketFromCity(cityId, supermarketId);
  }

  /**
 * Actualiza los supermercados que tiene una ciudad.
 * @param cityId
 * @param supermarkets
 */
  @Put(':cityId/supermarkets')
  async updateSupermarketsFromCity(@Param('cityId') cityId: string, @Body() supermarketsDto: SupermarketDto[]) {
    const supermarketsEntity: SupermarketEntity[] = plainToInstance(SupermarketEntity, supermarketsDto);
    return await this.citySupermarketService.updateSupermarketsFromCity(cityId, supermarketsEntity);
  }

  /**
  * Elimina el supermercado que tiene una ciudad.
  * @param cityId
  * @param supermarketId
  */
  @Delete(':cityId/supermarkets/:supermarketId')
  @HttpCode(204)
  async deleteSupermarketFromCity(@Param('cityId') cityId: string, @Param('supermarketId') supermarketId: string) {
    return await this.citySupermarketService.deleteSupermarketFromCity(cityId, supermarketId);
  }
}