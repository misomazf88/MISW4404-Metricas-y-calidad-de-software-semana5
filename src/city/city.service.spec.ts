import { CityEntity } from './city.entity';
import { CityService } from './city.service';
import { faker } from '@faker-js/faker';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';

describe('CityService', () => {
  let service: CityService;
  let repository: Repository<CityEntity>;
  let cityList: CityEntity[];
  let city: CityEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CityService],
    }).compile();

    service = module.get<CityService>(CityService);
    repository = module.get<Repository<CityEntity>>(getRepositoryToken(CityEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    cityList = [];
    for (let i = 0; i < 5; i++) {
      city = await repository.save({
        name: faker.company.name(),
        country: "Argentina",
        numberInhabitants: faker.datatype.number(),
        supermarkets: []
      })
      cityList.push(city);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll deberia retornar todas las ciudades', async () => {
    const cities: CityEntity[] = await service.findAll();
    expect(cities).not.toBeNull();
    expect(cities).toHaveLength(cityList.length);
  });

  it('findOne deberia retornar una ciudad por Id', async () => {
    const citiesStored: CityEntity = cityList[0];
    const city: CityEntity = await service.findOne(citiesStored.id);
    expect(city).not.toBeNull();
    expect(city.name).toEqual(citiesStored.name)
  });

  it('findOne debería lanzar una excepción para una ciudad inválida', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The city with the provided ID was not found.")
  });

  it('create deberia retornar un nuevo pais', async () => {
    const city: CityEntity = {
      id: "",
      name: faker.company.name(),
      country: "Argentina",
      numberInhabitants: faker.datatype.number(),
      supermarkets: [],
    }

    const newCity: CityEntity = await service.create(city);
    expect(newCity).not.toBeNull();

    const citiesStored: CityEntity = await repository.findOne({ where: { id: `${newCity.id}` } })
    expect(citiesStored).not.toBeNull();
    expect(citiesStored.name).toEqual(newCity.name)
  });

  it('update debería modificar una ciudad', async () => {
    const city: CityEntity = cityList[0];
    city.name = "Nuevo nombre";
    city.country = "Argentina"
    const updatedCity: CityEntity = await service.update(city.id, city);
    expect(updatedCity).not.toBeNull();
    const cityStored: CityEntity = await repository.findOne({ where: { id: `${city.id}` } })
    expect(cityStored).not.toBeNull();
    expect(cityStored.name).toEqual(city.name)
  });

  it('update debería lanzar una excepción para una ciudad inválida', async () => {
    let city: CityEntity = cityList[0];
    city = {
      ...city, name: "Nuevo nombre"
    }
    await expect(() => service.update("0", city)).rejects.toHaveProperty("message", "The city with the provided ID was not found.")
  });

  it('delete debería eliminar una ciudad', async () => {
    const city: CityEntity = cityList[0];
    await service.delete(city.id);
    const deletedCity: CityEntity = await repository.findOne({ where: { id: `${city.id}` } })
    expect(deletedCity).toBeNull();
  });

  it('delete debería lanzar una excepción para una ciudad inválida', async () => {
    const city: CityEntity = cityList[0];
    await service.delete(city.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The city with the provided ID was not found.")
  });
});