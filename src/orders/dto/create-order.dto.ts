import { Product } from '../../products/entities/product.entity';

export class CreateOrderDto {
  products: Product[];
}
