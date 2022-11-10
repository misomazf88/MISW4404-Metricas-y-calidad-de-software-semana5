import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { CityEntity } from './city.entity';
import { Country } from '../shared/enums/Country';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CityService {

  /**
  * Crea instancia de tipo Repository para entidad CityEntity.
  */
  constructor(
    @InjectRepository(CityEntity)
    private readonly cityRepository: Repository<CityEntity>
  ) { }

  /**
  * Retorna un listado de ciudades a partir de las ciudades existentes en db.
  * @returns CityEntity[]
  */
  async findAll(): Promise<CityEntity[]> {
    return await this.cityRepository.find({ relations: ["supermarkets"] });
  }

  /**
  * Retorna una ciudad a partir del id recibido como parametro.
  * @param cityId
  * @returns CityEntity
  */
  async findOne(cityId: string): Promise<CityEntity> {
    const city: CityEntity = await this.cityRepository.findOne({ where: { id: cityId }, relations: ["supermarkets"] });
    if (!city)
      throw new BusinessLogicException("The city with the provided ID was not found.", BusinessError.NOT_FOUND);
    return city;
  }

  /**
  * Crea una ciudad a partir de json recibido en body con representacion de la ciudad a almacenar en db, se valida que la ciudad este
  * en alguno de los paises (Argentina, Ecuador, Paraguay) de lo contrario se lanza excepcion de negoico.
  * @param cityEntity
  * @returns CityEntity
  */
  async create(cityEntity: CityEntity): Promise<CityEntity> {
    if (cityEntity.country != Country.Argentina && cityEntity.country != Country.Ecuador && cityEntity.country != Country.Paraguay)
      throw new BusinessLogicException("The country entered does not correspond to a valid one.", BusinessError.PRECONDITION_FAILED);
    return await this.cityRepository.save(cityEntity);
  }

  /**
  * Actualiza una ciudad a partir de id y de json recibido en body con representacion de la ciudad a almacenar en db, se valida que la ciudad este
  * en alguno de los paises (Argentina, Ecuador, Paraguay) de lo contrario se lanza excepcion de negoico.
  * @param cityId
  * @param cityEntity
  * @returns CityEntity
  */
  async update(cityId: string, cityEntity: CityEntity): Promise<CityEntity> {
    //Se busca ciudad por id recibido en peticion.
    const cityToPersist: CityEntity = await this.cityRepository.findOne({ where: { id: cityId } });
    if (!cityToPersist)
      throw new BusinessLogicException("The city with the provided ID was not found.", BusinessError.NOT_FOUND);

    if (cityEntity.country != Country.Argentina && cityEntity.country != Country.Ecuador && cityEntity.country != Country.Paraguay)
      throw new BusinessLogicException("The country entered does not correspond to a valid one.", BusinessError.PRECONDITION_FAILED);
    //Se asigna id de db a objeto recibido en peticion.
    cityEntity.id = cityId;
    //Se almacena objeto en db.
    return await this.cityRepository.save(cityEntity);
  }

  /**
  * Elimina una ciudad a partir de id se valida que la ciudad exista en db de lo contrario se lanza excepcion de negoico.
  * @param cityId
  */
  async delete(cityId: string) {
    //Se busca ciudad por id recibido en peticion.
    const city: CityEntity = await this.cityRepository.findOne({ where: { id: cityId } });
    //Si no existe la ciudad se lanza excepcion de negocio.
    if (!city)
      throw new BusinessLogicException("The city with the provided ID was not found.", BusinessError.NOT_FOUND);
    await this.cityRepository.remove(city);
  }
}