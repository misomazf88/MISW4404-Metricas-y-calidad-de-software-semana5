import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { CityDto } from './city.dto';
import { CityEntity } from './city.entity';
import { CityService } from './city.service';

@Controller('cities')
@UseInterceptors(BusinessErrorsInterceptor)
export class CityController {

  /**
  * Crea instancia cityService.
  */
  constructor(private readonly cityService: CityService) { }

  /**
  * Retorna un listado de ciudades a partir de las ciudades existentes en db.
  * @returns CityEntity[]
  */
  @Get()
  async findAll() {
    return await this.cityService.findAll();
  }

  /**
  * Retorna una ciudad a partir del id recibido como parametro.
  * @param cityId
  * @returns CityEntity
  */
  @Get(':cityId')
  async findOne(@Param('cityId') cityId: string) {
    return await this.cityService.findOne(cityId);
  }

  /**
  * Crea una ciudad a partir de json recibido en body con representacion de la ciudad a almacenar en db, se valida que la ciudad este
  * en alguno de los paises (Argentina, Ecuador, Paraguay) de lo contrario se lanza excepcion de negoico.
  * @param cityDto
  * @returns CityEntity
  */
  @Post()
  async create(@Body() cityDto: CityDto) {
    const cityEntity: CityEntity = plainToInstance(CityEntity, cityDto);
    return await this.cityService.create(cityEntity);
  }

  /**
  * Actualiza una ciudad a partir de id y de json recibido en body con representacion de la ciudad a almacenar en db, se valida que la ciudad este
  * en alguno de los paises (Argentina, Ecuador, Paraguay) de lo contrario se lanza excepcion de negoico.
  * @param cityId
  * @param cityDto
  * @returns CityEntity
  */
  @Put(':cityId')
  async update(@Param('cityId') cityId: string, @Body() cityDto: CityDto) {
    const cityEntity: CityEntity = plainToInstance(CityEntity, cityDto);
    return await this.cityService.update(cityId, cityEntity);
  }

  /**
  * Elimina una ciudad a partir de id se valida que la ciudad exista en db de lo contrario se lanza excepcion de negoico.
  * @param cityId
  */
  @Delete(':cityId')
  @HttpCode(204)
  async delete(@Param('cityId') cityId: string) {
    return await this.cityService.delete(cityId);
  }
}