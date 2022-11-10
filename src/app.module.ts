import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CityModule } from './city/city.module';
import { SupermarketModule } from './supermarket/supermarket.module';
import { CitySupermarketModule } from './city-supermarket/city-supermarket.module';
import { CityEntity } from './city/city.entity';
import { SupermarketEntity } from './supermarket/supermarket.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [CityModule, SupermarketModule, CitySupermarketModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'millonarios10',
      database: 'parcial',
      entities: [CityEntity, SupermarketEntity],
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true
    })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
