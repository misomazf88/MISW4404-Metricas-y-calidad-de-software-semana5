import { SupermarketEntity } from './supermarket.entity';
import { SupermermarketService } from './supermarket.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupermarketController } from './supermarket.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SupermarketEntity])],
  providers: [SupermermarketService],
  controllers: [SupermarketController]
})
export class SupermarketModule { }
