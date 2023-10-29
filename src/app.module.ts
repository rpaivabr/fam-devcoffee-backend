import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './products/entities/product.entity';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ExceptionInterceptor } from './interceptors/exception.interceptor';
import { OrdersModule } from './orders/orders.module';
import { Order } from './orders/entities/order.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mongodb',
      host: 'localhost',
      database: 'test',
      entities: [Product, Order],
      synchronize: true,
    }),
    ProductsModule,
    OrdersModule,
  ],
  providers: [{ provide: APP_INTERCEPTOR, useClass: ExceptionInterceptor }],
})
export class AppModule {}
