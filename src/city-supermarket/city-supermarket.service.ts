import { CityEntity } from '../city/city.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SupermarketEntity } from '../supermarket/supermarket.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class CitySupermarketService {

  /**
  * Crea instancias cityRepository, supermarketRepository de tipo Repository.
  */
  constructor(
    @InjectRepository(CityEntity)
    private readonly cityRepository: Repository<CityEntity>,

    @InjectRepository(SupermarketEntity)
    private readonly supermarketRepository: Repository<SupermarketEntity>
  ) { }

  /**
  * Asocia un supermercado a una ciudad.
  * @param cityId
  * @param supermarketId
  * @returns CityEntity
  */
  async addSupermarketToCity(cityId: string, supermarketId: string): Promise<CityEntity> {
    const supermarket: SupermarketEntity = await this.supermarketRepository.findOne({ where: { id: supermarketId } });
    if (!supermarket)
      throw new BusinessLogicException("The supermarket with the provided ID was not found.", BusinessError.NOT_FOUND);
    const cityToPersist: CityEntity = await this.cityRepository.findOne({ where: { id: cityId }, relations: ["supermarkets"] })
    if (!cityToPersist)
      throw new BusinessLogicException("The city with the provided ID was not found.", BusinessError.NOT_FOUND);
    cityToPersist.supermarkets = [...cityToPersist.supermarkets, supermarket];
    return await this.cityRepository.save(cityToPersist);
  }

  /**
  * Obtiene los supermercados que tiene una ciudad.
  * @param cityId
  * @returns SupermarketEntity[]
  */
  async findSupermarketsFromCity(cityId: string): Promise<SupermarketEntity[]> {
    const cityEntity: CityEntity = await this.cityRepository.findOne({ where: { id: cityId }, relations: ["supermarkets"] });
    if (!cityEntity)
      throw new BusinessLogicException("The city with the provided ID was not found.", BusinessError.NOT_FOUND)
    return cityEntity.supermarkets;
  }

  /**
  * Obtiene un supermercado de una ciudad.
  * @param cityId
  * @param supermarketId
  * @returns SupermarketEntity
  */
  async findSupermarketFromCity(cityId: string, supermarketId: string): Promise<SupermarketEntity> {
    const supermercado: SupermarketEntity = await this.supermarketRepository.findOne({ where: { id: supermarketId } });
    if (!supermercado)
      throw new BusinessLogicException("The supermarket with the provided ID was not found.", BusinessError.NOT_FOUND)
    const ciudad: CityEntity = await this.cityRepository.findOne({ where: { id: cityId }, relations: ["supermarkets"] });
    if (!ciudad)
      throw new BusinessLogicException("The city with the provided ID was not found.", BusinessError.NOT_FOUND)
    const supermarketCity: SupermarketEntity = ciudad.supermarkets.find(e => e.id === supermercado.id);
    if (!supermarketCity)
      throw new BusinessLogicException("The supermarket with the provided id is not associated with the city.", BusinessError.PRECONDITION_FAILED)
    return supermarketCity;
  }

  /**
  * Actualiza los supermercados que tiene una ciudad.
  * @param cityId
  * @param supermarkets
  * @returns CityEntity
  */
  async updateSupermarketsFromCity(cityId: string, supermarkets: SupermarketEntity[]): Promise<CityEntity> {
    const cityEntity: CityEntity = await this.cityRepository.findOne({ where: { id: cityId }, relations: ["supermarkets"] });
    if (!cityEntity)
      throw new BusinessLogicException("The city with the provided ID was not found.", BusinessError.NOT_FOUND)
    for (let i = 0; i < supermarkets.length; i++) {
      const supermarketEntity: SupermarketEntity = await this.supermarketRepository.findOne({ where: { id: `${supermarkets[i].id}` } });
      if (!supermarketEntity)
        throw new BusinessLogicException("The supermarket with the provided ID was not found.", BusinessError.NOT_FOUND)
    }
    cityEntity.supermarkets = supermarkets;
    return await this.cityRepository.save(cityEntity);
  }

  /**
  * Elimina el supermercado que tiene una ciudad.
  * @param cityId
  * @param supermarketId
  */
  async deleteSupermarketFromCity(cityId: string, supermarketId: string) {
    for (let i = 0; i < 5; i++) {
      i=5
    }
    const supermarketEntity: SupermarketEntity = await this.supermarketRepository.findOne({ where: { id: supermarketId } });
    if (!supermarketEntity)
      throw new BusinessLogicException("The supermarket with the provided ID was not found.", BusinessError.NOT_FOUND)
    const cityEntity: CityEntity = await this.cityRepository.findOne({ where: { id: cityId }, relations: ["supermarkets"] });
    if (!cityEntity)
      throw new BusinessLogicException("The city with the provided ID was not found.", BusinessError.NOT_FOUND)
    const citySupermarket: SupermarketEntity = cityEntity.supermarkets.find(e => e.id === supermarketEntity.id);

    if (!citySupermarket)
      throw new BusinessLogicException("The supermarket with the provided id is not associated with the city.", BusinessError.PRECONDITION_FAILED)

    cityEntity.supermarkets = cityEntity.supermarkets.filter(e => e.id !== supermarketId);
    await this.cityRepository.save(cityEntity);
  }
}