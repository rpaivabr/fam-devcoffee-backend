# FAM Minicurso Fullstack JS: Parte I - Backend com NestJS (30/10/2023)

## Instalação Programas

- Download: [NodeJS](https://nodejs.org/en/download)
- Download: [VsCode](https://code.visualstudio.com/download)
- Download: [Git](https://git-scm.com/downloads)

&nbsp;

## Instalar Nest CLI (precisa Node e NPM)

```
npm i -g @nestjs/cli
```

&nbsp;

## Configuração Inicial

### Opção 1 - Criar novo projeto

Criar e instalar dependências:

```
nest new dev-coffee-api
```

Acessar a pasta e rodar projeto localmente (http://localhost:3000):

```
cd dev-coffee-api
npm run start
```

### Opção 2 - Clonar este repositório

```
git clone https://github.com/rpaivabr/fam-devcoffee-backend.git
cd dev-coffee-api
npm install
npm run start
```

&nbsp;

## Etapa 1

### Criando recursos (Rest / CRUD)

Vscode Ext Rest (ThunderClient):

```
POST    /products
GET     /products
GET     /products/:id
PUT     /products/:id
DELETE  /products/:id

POST    /orders
GET     /orders
GET     /orders/:id
PATCH   /orders/:id
```

Criar recursos (products - orders):

```
nest g resource
```

Exemplos de produtos

```
// products.ts
export const products: Product[] = [
  {
    id: 1,
    name: 'Expresso Tradicional',
    description: 'O tradicional café feito com água quente e grãos moídos',
    price: 9.9,
    tags: ['Tradicional'],
  },
  {
    id: 2,
    name: 'Expresso Americano',
    description: 'Expresso diluído, menos intenso que o tradicional',
    price: 9.9,
    tags: ['Tradicional'],
  },
  {
    id: 3,
    name: 'Expresso Cremoso',
    description: 'Café expresso tradicional com espuma cremosa',
    price: 9.9,
    tags: ['Tradicional'],
  },
  {
    id: 4,
    name: 'Expresso Gelado',
    description: 'Bebida preparada com café expresso e cubos de gelo',
    price: 9.9,
    tags: ['Tradicional', 'Gelado'],
  },
  {
    id: 5,
    name: 'Café com Leite',
    description: 'Meio a meio de expresso tradicional com leite vaporizado',
    price: 9.9,
    tags: ['Tradicional', 'Com leite'],
  },
];
```

- Documentação: [recipes/crud-generator](https://docs.nestjs.com/recipes/crud-generator)

&nbsp;

## Etapa 2

### Criando serviço repositório (Database / ORM)

Instalar e configurar TypeORM dependências:

```
npm install --save @nestjs/typeorm typeorm
```

### Opção 1 - Sqlite

```
npm install --save sqlite3
```

```
// app.module.ts
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: ':memory:',
      autoLoadEntities: true,
      synchronize: true,
    }),
  ]
})
```

```
// products.module.ts
@Module({
  imports: [TypeOrmModule.forFeature([Product])],
})
```

```
// product.entity.ts
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  price: number;
}
```

```
// products.service.ts
@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}
}
```

### Opção 2 - MySQL

```
npm install --save mysql2
```

```
// app.module.ts
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'test',
      autoLoadEntities: true,
      synchronize: true,
    }),
  ]
})
```

### Opção 3 - Mongo

```
npm install --save mysql2
```

```
// app.module.ts
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mongodb',
      host: 'localhost',
      database: 'test',
      entities: [Products],
      synchronize: true,
    }),
  ]
})
```

```
// product.entity.ts
import { Column, Entity, ObjectId, ObjectIdColumn } from 'typeorm';

@Entity()
export class Product {

  @ObjectIdColumn()
  id: ObjectId;
}
```

```
// products.service.ts
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: MongoRepository<Product>,
  ) {}
}
```

- Documentação: [recipes/sql-typeorm](https://docs.nestjs.com/recipes/sql-typeorm)
- Exemplos: [05-sql-typeorm](https://github.com/nestjs/nest/tree/master/sample/05-sql-typeorm) | [13-mongo-typeorm](https://github.com/nestjs/nest/tree/master/sample/13-mongo-typeorm)

&nbsp;

## Etapa 3 (Extra)

### Interceptors

Error Interceptor

```
// exception.interceptor.ts
import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  NotFoundException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { EntityNotFoundError } from 'typeorm';

@Injectable()
export class ExceptionInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        if (err instanceof EntityNotFoundError) {
          return throwError(() => new NotFoundException());
        }
        if (
          err.message ===
          'Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer'
        ) {
          return throwError(() => new BadRequestException('Invalid Id'));
        }
        return throwError(() => err);
      }),
    );
  }
}
```

Logging Interceptor

```
// logging.interceptor.ts
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Before...');

    const now = Date.now();
    return next
      .handle()
      .pipe(tap(() => console.log(`After... ${Date.now() - now}ms`)));
  }
}
```

Transform Interceptor

```
// transform.interceptor.ts
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<Response<T>> {
    return next.handle().pipe(map((data) => ({ data })));
  }
}
```

- Documentação: [overview/interceptors](https://docs.nestjs.com/interceptors)

### Performance

Fastify

```
npm i --save @nestjs/platform-fastify
```

```
// main.ts
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  await app.listen(3000, 'localhost');
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
```

- Documentação: [techniques/performance](https://docs.nestjs.com/techniques/performance)
- Exemplos: [fastify](https://github.com/nestjs/nest/tree/master/sample/10-fastify)

### Documentação

Swagger

```
npm install --save @nestjs/swagger
```

```
// main.ts
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('DevCoffee example')
    .setDescription('The DevCoffee API description')
    .setVersion('1.0')
    .addTag('devcoffee')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
```

```
// products.controller.ts
@ApiTags('products')
@Controller('products')
export class ProductsController {}
```

- Documentação: [recipes/swagger](https://docs.nestjs.com/openapi/introduction)
- Exemplos: [11-swagger](https://github.com/nestjs/nest/tree/master/sample/11-swagger)

&nbsp;
