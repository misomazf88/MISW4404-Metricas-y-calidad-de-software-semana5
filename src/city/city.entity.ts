import { Entity, ManyToMany, Column, PrimaryGeneratedColumn } from "typeorm";
import { SupermarketEntity } from "../supermarket/supermarket.entity";

@Entity()
export class CityEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  country: string;

  @Column()
  numberInhabitants: number;

  @ManyToMany(() => SupermarketEntity, supermarket => supermarket.cities)
  supermarkets: SupermarketEntity[];
}