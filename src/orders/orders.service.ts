import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ObjectId } from 'mongodb';
import { Order, Status } from './entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: MongoRepository<Order>,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    return this.ordersRepository.save({
      ...createOrderDto,
      status: Status.Pending,
    });
  }

  async findAll() {
    return this.ordersRepository.find();
  }

  async findOne(id: string) {
    return this.ordersRepository.findOneByOrFail(new ObjectId(id));
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    const order = await this.ordersRepository.findOneByOrFail(new ObjectId(id));

    if (!Object.values(Status).includes(updateOrderDto.status))
      throw new BadRequestException('Invalid status');

    order.status = updateOrderDto.status ?? order.status;

    return this.ordersRepository.save(order);
  }
}
