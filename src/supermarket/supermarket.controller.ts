import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { SupermarketDto } from './supermarket.dto';
import { SupermarketEntity } from './supermarket.entity';
import { SupermermarketService } from './supermarket.service';

@Controller('supermarkets')
@UseInterceptors(BusinessErrorsInterceptor)
export class SupermarketController {

  /**
  * Crea instancia supermarketService.
  */
  constructor(private readonly supermarketService: SupermermarketService) { }

  /**
  * Retorna un listado de supermercados a partir de los supermercados existentes en db.
  * @returns SupermarketEntity[]
  */
  @Get()
  async findAll() {
    return await this.supermarketService.findAll();
  }

  /**
  * Retorna un supermercado a partir del id recibido como parametro.
  * @param supermarketId
  * @returns SupermarketEntity
  */
  @Get(':supermarketId')
  async findOne(@Param('supermarketId') supermarketId: string) {
    return await this.supermarketService.findOne(supermarketId);
  }

  /**
 * Crea un supermercado a partir de json recibido en body con representacion de la supermercado a almacenar en db, se valida que el
 * nombre tenga mas de 10 caracteres, de lo contrario se lanza excepcion de negoico.
 * @param supermarketDto
 * @returns SupermarketEntity
 */
  @Post()
  async create(@Body() supermarketDto: SupermarketDto) {
    const supermarketEntity: SupermarketEntity = plainToInstance(SupermarketEntity, supermarketDto);
    return await this.supermarketService.create(supermarketEntity);
  }

  /**
 * Actualiza una supermercado a partir de id y de json recibido en body con representacion de la supermercado a almacenar en db, se valida que el
 * nombre tenga mas de 10 caracteres, de lo contrario se lanza excepcion de negoico.
 * @param supermarketId
 * @param supermarketDto
 * @returns SupermarketEntity
 */
  @Put(':supermarketId')
  async update(@Param('supermarketId') supermarketId: string, @Body() supermarketDto: SupermarketDto) {
    const supermarketEntity: SupermarketEntity = plainToInstance(SupermarketEntity, supermarketDto);
    return await this.supermarketService.update(supermarketId, supermarketEntity);
  }

  /**
 * Elimina una supermercado a partir de id, se valida que el supermercado exista en db de lo contrario se lanza excepcion de negoico.
 * @param supermarketId
 */
  @Delete(':supermarketId')
  @HttpCode(204)
  async delete(@Param('supermarketId') supermarketId: string) {
    return await this.supermarketService.delete(supermarketId);
  }
}