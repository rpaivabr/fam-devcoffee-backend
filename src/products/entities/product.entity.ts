import { Column, Entity, ObjectId, ObjectIdColumn } from 'typeorm';

@Entity()
export class Product {
  @ObjectIdColumn()
  id: ObjectId;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  price: number;

  @Column()
  tags: string[];
}
