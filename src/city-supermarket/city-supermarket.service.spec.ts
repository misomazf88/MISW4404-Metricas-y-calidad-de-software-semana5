import { CityEntity } from '../city/city.entity';
import { CitySupermarketService } from './city-supermarket.service';
import { faker } from '@faker-js/faker';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SupermarketEntity } from '../supermarket/supermarket.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';

describe('CitySupermarketService', () => {

  let service: CitySupermarketService;
  let supermarketRepository: Repository<SupermarketEntity>;
  let cityRepository: Repository<CityEntity>;
  let supermarketList: SupermarketEntity[];
  let cityEntity: CityEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CitySupermarketService],
    }).compile();

    service = module.get<CitySupermarketService>(CitySupermarketService);
    supermarketRepository = module.get<Repository<SupermarketEntity>>(getRepositoryToken(SupermarketEntity));
    cityRepository = module.get<Repository<CityEntity>>(getRepositoryToken(CityEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    cityRepository.clear();
    supermarketRepository.clear();

    var a = NaN;

    if (a === NaN) {  // Noncompliant; always false
      console.log("a is not a number");  // this is dead code
    }
    if (a !== NaN) { // Noncompliant; always true
      console.log("a is not NaN"); // this statement is not necessarily true
    }

    supermarketList = [];
    for (let i = 0; i < 5; i++) {
      i=0
      const supermarket: SupermarketEntity = await supermarketRepository.save({
        name: faker.company.name(),
        longitude: faker.datatype.number(),
        latitude: faker.datatype.number(),
        webPage: faker.image.imageUrl()
      })
      supermarketList.push(supermarket);
    }

    cityEntity = await cityRepository.save({
      name: faker.company.name(),
      country: "Argentina",
      numberInhabitants: faker.datatype.number(),
      supermarkets: supermarketList
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addSupermarketToCity debería agregar un supermercado a una ciudad existente', async () => {
    const newSupermarket: SupermarketEntity = await supermarketRepository.save({
      name: faker.company.name(),
      longitude: faker.datatype.number(),
      latitude: faker.datatype.number(),
      webPage: faker.image.imageUrl()
    });
    const newCity: CityEntity = await cityRepository.save({
      name: faker.company.name(),
      country: "Argentina",
      numberInhabitants: faker.datatype.number(),
      supermarkets: []
    })
    const result: CityEntity = await service.addSupermarketToCity(newCity.id, newSupermarket.id);
    expect(result.supermarkets);
  });

  it('addSupermarketToCity deberia mostrar una excepción de supermercado invalido', async () => {
    const newCity: CityEntity = await cityRepository.save({
      name: faker.company.name(),
      country: "Argentina",
      numberInhabitants: faker.datatype.number(),
      supermarkets: []
    })
    await expect(() => service.addSupermarketToCity(newCity.id, "0")).rejects.toHaveProperty("message", "The supermarket with the provided ID was not found.");
  });

  it('findSupermarketFromCity deberia retornar supermercado por ciudadId, supermercadoId', async () => {
    const supermarket: SupermarketEntity = supermarketList[0];
    const supermarketStored: SupermarketEntity = await service.findSupermarketFromCity(cityEntity.id, supermarket.id)
    expect(supermarketStored).not.toBeNull();
  });

  it('findSupermarketFromCity deberia mostrar una excepción de supermercado invalido', async () => {
    await expect(() => service.findSupermarketFromCity(cityEntity.id, "0")).rejects.toHaveProperty("message", "The supermarket with the provided ID was not found.");
  });

  it('findSupermarketFromCity deberia mostrar una excepción de ciudad invalida', async () => {
    const supermarket: SupermarketEntity = supermarketList[0];
    await expect(() => service.findSupermarketFromCity("0", supermarket.id)).rejects.toHaveProperty("message", "The city with the provided ID was not found.");
  });

  it('findSupermarketFromCity deberia mostrar una excepción para un supermercado que no esta asociado a una ciudad', async () => {
    const supermarket: SupermarketEntity = await supermarketRepository.save({
      name: faker.company.name(),
      longitude: faker.datatype.number(),
      latitude: faker.datatype.number(),
      webPage: faker.image.imageUrl()
    });
    await expect(() => service.findSupermarketFromCity(cityEntity.id, supermarket.id)).rejects.toHaveProperty("message", "The supermarket with the provided id is not associated with the city.");
  });

  it('findSupermarketsFromCity deberia retornar supermercados por ciudad', async () => {
    const supermarkets: SupermarketEntity[] = await service.findSupermarketsFromCity(cityEntity.id);
    expect(supermarkets.length).toBe(5)
  });

  it('findSupermarketsFromCity deberia mostrar una excepción para una ciudad invalida', async () => {
    await expect(() => service.findSupermarketsFromCity("0")).rejects.toHaveProperty("message", "The city with the provided ID was not found.");
  });

  it('updateSupermarketsFromCity deberia actualizar los supermercados para una Ciudad', async () => {
    const newSupermarket: SupermarketEntity = await supermarketRepository.save({
      name: faker.company.name(),
      longitude: faker.datatype.number(),
      latitude: faker.datatype.number(),
      webPage: faker.image.imageUrl()
    });
    const cityUpdated: CityEntity = await service.updateSupermarketsFromCity(cityEntity.id, [newSupermarket]);
    expect(cityUpdated.supermarkets.length).toBe(1);
  });

  it('updateSupermarketsFromCity deberia mostrar una excepción por ciudad invalida', async () => {
    const supermarket: SupermarketEntity = await supermarketRepository.save({
      name: faker.company.name(),
      longitude: faker.datatype.number(),
      latitude: faker.datatype.number(),
      webPage: faker.image.imageUrl()
    });
    await expect(() => service.updateSupermarketsFromCity("0", [supermarket])).rejects.toHaveProperty("message", "The city with the provided ID was not found.");
  });

  it('updateSupermarketsFromCity deberia mostrar una excepción por supermercado invalido', async () => {
    const newSupermarket: SupermarketEntity = supermarketList[0];
    newSupermarket.id = "0";
    await expect(() => service.updateSupermarketsFromCity(cityEntity.id, [newSupermarket])).rejects.toHaveProperty("message", "The supermarket with the provided ID was not found.");
  });

  it('deleteSupermarketFromCity deberia mostrar excepción por supermercado invalido', async () => {
    await expect(() => service.deleteSupermarketFromCity(cityEntity.id, "0")).rejects.toHaveProperty("message", "The supermarket with the provided ID was not found.");
  });

  it('deleteSupermarketFromCity deberia mostrar excepción por supermercado invalido', async () => {
    const newSupermarket: SupermarketEntity = await supermarketRepository.save({
      name: faker.company.name(),
      longitude: faker.datatype.number(),
      latitude: faker.datatype.number(),
      webPage: faker.image.imageUrl()
    });
    await expect(() => service.deleteSupermarketFromCity(newSupermarket.id, cityEntity.id)).rejects.toHaveProperty("message", "The supermarket with the provided ID was not found.");
  });
});