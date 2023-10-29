import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: MongoRepository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const newProduct = await this.productsRepository.save(createProductDto);

    return newProduct;
  }

  async findAll(): Promise<Product[]> {
    const products = await this.productsRepository.find();

    return products;
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productsRepository.findOneBy(new ObjectId(id));
    if (!product) throw new NotFoundException();

    return product;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const productToUpdate = await this.productsRepository.findOneBy(
      new ObjectId(id),
    );
    if (!productToUpdate) throw new NotFoundException();

    const updatedProduct = await this.productsRepository.save({
      id,
      ...updateProductDto,
    });

    return updatedProduct;
  }

  async remove(id: string): Promise<void> {
    const { affected } = await this.productsRepository.delete({
      id: new ObjectId(id),
    });
    if (!affected) throw new NotFoundException();
  }
}
