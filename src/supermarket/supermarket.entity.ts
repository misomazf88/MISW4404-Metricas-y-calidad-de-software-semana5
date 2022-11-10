
import { CityEntity } from "../city/city.entity";
import { Entity, JoinTable, ManyToMany, Column, PrimaryGeneratedColumn,} from "typeorm";

@Entity()
export class SupermarketEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  longitude: number;

  @Column()
  latitude: number;

  @Column()
  webPage: string;

  @ManyToMany(() => CityEntity, city => city.supermarkets)
  @JoinTable()
  cities: CityEntity[];
}