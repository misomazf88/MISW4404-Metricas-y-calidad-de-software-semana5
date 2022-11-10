import { CityEntity } from '../city/city.entity';
import { faker } from '@faker-js/faker';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SupermarketEntity } from './supermarket.entity';
import { SupermermarketService } from './supermarket.service';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';

describe('SupermarketService', () => {
  let service: SupermermarketService;
  let repository: Repository<SupermarketEntity>;
  let repositoryCity: Repository<CityEntity>;
  let supermarketList: SupermarketEntity[];
  let supermarket: SupermarketEntity;
  let cityList: CityEntity[];
  let city: CityEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [SupermermarketService],
    }).compile();

    service = module.get<SupermermarketService>(SupermermarketService);
    repository = module.get<Repository<SupermarketEntity>>(getRepositoryToken(SupermarketEntity));
    repositoryCity = module.get<Repository<CityEntity>>(getRepositoryToken(CityEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    supermarketList = [];

    cityList = [];
    for (let i = 0; i < 5; i++) {
      city = await repositoryCity.save({
        name: faker.company.name(),
        country: "Argentina",
        numberInhabitants: faker.datatype.number(),
        supermarkets: []
      })
      cityList.push(city);
    }

    for (let i = 0; i < 5; i++) {
      supermarket = await repository.save({
        name: faker.company.name(),
        longitude: faker.datatype.number(),
        latitude: faker.datatype.number(),
        webPage: faker.image.imageUrl()
      })
      supermarketList.push(supermarket);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll deberia retornar todos los supermercados', async () => {
    const supermarkets: SupermarketEntity[] = await service.findAll();
    expect(supermarkets).not.toBeNull();
    expect(supermarkets).toHaveLength(supermarketList.length);
  });

  it('findOne deberia retornar un supermercado por Id', async () => {
    const supermarketStored: SupermarketEntity = supermarketList[0];
    const supermarket: SupermarketEntity = await service.findOne(supermarketStored.id);
    expect(supermarket).not.toBeNull();
    expect(supermarket.name).toEqual(supermarketStored.name)
  });

  it('findOne debería lanzar una excepción para un supermercado inválido', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The supermarket with the provided ID was not found.")
  });

  it('create deberia retornar un nuevo supermercado', async () => {
    const supermarket: SupermarketEntity = {
      id: "",
      name: faker.company.name(),
      longitude: faker.datatype.number(),
      latitude: faker.datatype.number(),
      webPage: faker.image.imageUrl(),
      cities: cityList
    }

    const newSupermarket: SupermarketEntity = await service.create(supermarket);
    expect(newSupermarket).not.toBeNull();

    const supermarketStored: SupermarketEntity = await repository.findOne({ where: { id: `${newSupermarket.id}` } })
    expect(supermarketStored).not.toBeNull();
    expect(supermarketStored.name).toEqual(newSupermarket.name)
  });

  it('update debería modificar un supermercado', async () => {
    const supermarket: SupermarketEntity = supermarketList[0];
    supermarket.name = "Almacen Exito";
    supermarket.longitude = 123
    const updatedSupermarket: SupermarketEntity = await service.update(supermarket.id, supermarket);
    expect(updatedSupermarket).not.toBeNull();
    const supermarketStored: SupermarketEntity = await repository.findOne({ where: { id: `${supermarket.id}` } })
    expect(supermarketStored).not.toBeNull();
    expect(supermarketStored.name).toEqual(supermarket.name)
  });

  it('update debería lanzar una excepción para un supermercado inválido', async () => {
    let supermarket: SupermarketEntity = supermarketList[0];
    supermarket = {
      ...supermarket, name: "Almacen Carulla"
    }
    await expect(() => service.update("0", supermarket)).rejects.toHaveProperty("message", "The supermarket with the provided ID was not found.")
  });

  it('delete debería eliminar un supermercado', async () => {
    const supermarket: SupermarketEntity = supermarketList[0];
    await service.delete(supermarket.id);
    const deletedSupermarket: SupermarketEntity = await repository.findOne({ where: { id: `${supermarket.id}` } })
    expect(deletedSupermarket).toBeNull();
  });

  it('delete debería lanzar una excepción para un supermercado inválido', async () => {
    const supermarket: SupermarketEntity = supermarketList[0];
    await service.delete(supermarket.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The supermarket with the provided ID was not found.")
  });
});