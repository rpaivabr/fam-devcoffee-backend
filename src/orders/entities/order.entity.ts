import { Column, Entity, ObjectId, ObjectIdColumn } from 'typeorm';
import { Product } from '../../products/entities/product.entity';

export enum Status {
  Pending = 'pending',
  Completed = 'completed',
  Canceled = 'canceled',
}

@Entity()
export class Order {
  @ObjectIdColumn()
  id: ObjectId;

  @Column({ type: 'simple-enum' })
  status: Status;

  @Column()
  products: Product[];
}
