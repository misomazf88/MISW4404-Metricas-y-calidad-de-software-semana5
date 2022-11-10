import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { SupermarketEntity } from './supermarket.entity';

@Injectable()
export class SupermermarketService {

  /**
  * Crea instancia de Repository para entidad SupermarketEntity.
  */
  constructor(
    @InjectRepository(SupermarketEntity)
    private readonly supermarketRepository: Repository<SupermarketEntity>
  ) { }

  /**
  * Retorna un listado de supermercados a partir de las supermercados existentes en db.
  * @returns SupermarketEntity[]
  */
  async findAll(): Promise<SupermarketEntity[]> {
    return await this.supermarketRepository.find({ relations: ["cities"] });
  }

  /**
  * Retorna un supermercado a partir del id recibido como parametro.
  * @param supermarketId
  * @returns SupermarketEntity
  */
  async findOne(supermarketId: string): Promise<SupermarketEntity> {
    const supermarket: SupermarketEntity = await this.supermarketRepository.findOne({ where: { id: supermarketId }, relations: ["cities"] });
    if (!supermarket)
      throw new BusinessLogicException("The supermarket with the provided ID was not found.", BusinessError.NOT_FOUND);
    return supermarket;
  }

  /**
  * Crea un supermercado a partir de json recibido en body con representacion de la supermercado a almacenar en db, se valida que el
  * nombre tenga mas de 10 caracteres, de lo contrario se lanza excepcion de negoico.
  * @param supermarketEntity
  * @returns SupermarketEntity
  */
  async create(supermarketEntity: SupermarketEntity): Promise<SupermarketEntity> {
    if (supermarketEntity.name.length <= 10)
      throw new BusinessLogicException("The name of the supermarket must have more than 10 characters.", BusinessError.PRECONDITION_FAILED);
    return await this.supermarketRepository.save(supermarketEntity);
  }

  /**
  * Actualiza una supermercado a partir de id y de json recibido en body con representacion de la supermercado a almacenar en db, se valida que el
  * nombre tenga mas de 10 caracteres, de lo contrario se lanza excepcion de negoico.
  * @param supermarketId
  * @param supermarketEntity
  * @returns SupermarketEntity
  */
  async update(supermarketId: string, supermarketEntity: SupermarketEntity): Promise<SupermarketEntity> {
    //Se busca supermercado por id recibido en peticion.
    const supermarketToPersist: SupermarketEntity = await this.supermarketRepository.findOne({ where: { id: supermarketId } });
    if (!supermarketToPersist)
      throw new BusinessLogicException("The supermarket with the provided ID was not found.", BusinessError.NOT_FOUND);

    if (supermarketEntity.name.length <= 10)
      throw new BusinessLogicException("The name of the supermarket must have more than 10 characters.", BusinessError.PRECONDITION_FAILED);
    //Se asigna id de db a objeto recibido en peticion.
    supermarketEntity.id = supermarketId;
    //Se almacena objeto en db.
    return await this.supermarketRepository.save(supermarketEntity);
  }

  /**
  * Elimina una supermercado a partir de id, se valida que el supermercado exista en db de lo contrario se lanza excepcion de negoico.
  * @param supermarketId
  */
  async delete(supermarketId: string) {
    //Se busca supermercado por id recibido en peticion.
    const supermarket: SupermarketEntity = await this.supermarketRepository.findOne({ where: { id: supermarketId } });
    //Si no existe la supermercado se lanza excepcion de negocio.
    if (!supermarket)
      throw new BusinessLogicException("The supermarket with the provided ID was not found.", BusinessError.NOT_FOUND);
    await this.supermarketRepository.remove(supermarket);
  }
}