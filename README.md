#  TypeORM / Express / TypeScript RESTful API boilerplate

[![CI][build-badge]][build-url]
[![TypeScript][typescript-badge]][typescript-url]
[![prettier][prettier-badge]][prettier-url]
![Heisenberg](misc/heisenberg.png)

Boilerplate with focus on best practices and painless developer experience:

- Minimal setup that can be extended 🔧
- Spin it up with single command 🌀
- TypeScript first
- RESTful APIs
- JWT authentication with role based authorization

## Requirements

- [Node v16+](https://nodejs.org/)
- [Docker](https://www.docker.com/)

## Running

_Easily set up a local development environment with single command!_

- clone the repo
- `npm run docker:dev` 🚀

Visit [localhost:4000](http://localhost:4000/) or if using Postman grab [config](/postman).

---

## Lab 5-6 extension: custom entities + REST API + service layer/validation/DTO

This repo was extended with entities from a PostgreSQL database (tables are kept intact):

### Entities and relations

- **Address** (`addresses`) 1..* **Customer** (`customers`)
- **Customer** 1..* **CustomerOrder** (`customer_orders`)
- **CustomerOrder** 1..* **OrderItem** (`order_items`)
- **CheeseProduct** (`cheese_products`) 1..* **OrderItem**

In other words: `Order -> Customer -> Address` and `Order -> Items -> Product`.

### API endpoints

CRUD is implemented for each entity. Some endpoints are protected with JWT and role checks.

**Products** (`/v1/products`)
- `GET /` - list
- `GET /:id`
- `POST /` *(ADMINISTRATOR)*
- `PATCH /:id` *(ADMINISTRATOR)*
- `DELETE /:id` *(ADMINISTRATOR)*

**Addresses** (`/v1/addresses`)
- `GET /` - list
- `GET /:id`
- `POST /` *(ADMINISTRATOR)*
- `PATCH /:id` *(ADMINISTRATOR)*
- `DELETE /:id` *(ADMINISTRATOR)*

**Customers** (`/v1/customers`)
- `GET /` - list
- `GET /:id`
- `POST /` *(ADMINISTRATOR)*
- `PATCH /:id` *(ADMINISTRATOR)*
- `DELETE /:id` *(ADMINISTRATOR)*

**Orders** (`/v1/orders`)
- `GET /` - list (with joins)
- `GET /:id` (with joins)
- `POST /` *(authorized)*
- `PATCH /:id` *(ADMINISTRATOR)*
- `DELETE /:id` *(ADMINISTRATOR)*

### Architecture (Lab 6)

The code follows **Separation of Concerns**:

- **Middleware (validation)**: validates incoming request data and throws `CustomError` (400).
- **Controller**: orchestrates request handling, calls services, converts entities to DTO.
- **Service**: contains business logic and repository calls.
- **Repository (TypeORM)**: DB access through `getRepository(Entity)`.

#### Example: validation middleware

```ts
// src/middleware/validation/product/validatorCreateProduct.ts
import { Request, Response, NextFunction } from 'express';
import validator from 'validator';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const validatorCreateProduct = (req: Request, _res: Response, next: NextFunction) => {
  const { name, basePrice, cheeseType } = req.body ?? {};

  if (!name || validator.isEmpty(String(name))) {
    throw new CustomError(400, 'Validation', 'Product validation error', ['Product name is required']);
  }

  if (!cheeseType || validator.isEmpty(String(cheeseType))) {
    throw new CustomError(400, 'Validation', 'Product validation error', ['Cheese type is required']);
  }

  if (basePrice === undefined || basePrice === null || !validator.isFloat(String(basePrice), { gt: 0 })) {
    throw new CustomError(400, 'Validation', 'Product validation error', ['Price must be a number greater than 0']);
  }

  return next();
};
```

#### Example: service class

```ts
// src/services/product.service.ts
import { getRepository, Repository } from 'typeorm';
import { CheeseProduct } from '../orm/entities/CheeseProduct';

export class ProductService {
  private get repo(): Repository<CheeseProduct> {
    return getRepository(CheeseProduct);
  }

  async create(dto: { name: string; cheeseType?: string; basePrice?: string | number; isActive?: boolean }) {
    const entity = this.repo.create({
      name: dto.name,
      cheeseType: dto.cheeseType,
      basePrice: dto.basePrice !== undefined && dto.basePrice !== null ? String(dto.basePrice) : '0',
      isActive: dto.isActive ?? true,
    });
    return this.repo.save(entity);
  }
}
```

#### Example: Response DTO

```ts
// src/dto/response/ProductResponseDto.ts
import { CheeseProduct } from '../../orm/entities/CheeseProduct';

export class ProductResponseDto {
  id: number;
  title: string;
  cost: number;
  available: boolean;
  cheeseType: string;

  constructor(product: CheeseProduct) {
    this.id = product.id;
    this.title = product.name;
    this.cost = Number(product.basePrice);
    this.available = product.isActive;
    this.cheeseType = product.cheeseType;
  }
}
```

### Postman screenshots

Add screenshots to the repository (e.g. `docs/screenshots/`) showing:

- a request with invalid input returning **400 Bad Request** from validation middleware
- a successful request returning the **ResponseDTO** structure

### _What happened_ 💥

Containers created:

- Postgres database container seeded with 💊 Breaking Bad characters in `Users` table (default credentials `user=walter`, `password=white` in [.env file](./.env))
- Node (v16 Alpine) container with running boilerplate RESTful API service
- and one Node container instance to run tests locally or in CI

## Features:

- [Express](https://github.com/expressjs/express) framework
- [TypeScript v4](https://github.com/microsoft/TypeScript) codebase
- [TypeORM](https://typeorm.io/) using Data Mapper pattern
- [Docker](https://www.docker.com/) environment:
  - Easily start local development using [Docker Compose](https://docs.docker.com/compose/) with single command `npm run docker:dev`
  - Connect to different staging or production environments `npm run docker:[stage|prod]`
  - Ready for **microservices** development and deployment.  
    Once API changes are made, just build and push new docker image with your favourite CI/CD tool  
    `docker build -t <username>/api-boilerplate:latest .`  
    `docker push <username>/api-boilerplate:latest`
  - Run unit, integration (or setup with your frontend E2E) tests as `docker exec -ti be_boilerplate_test sh` and `npm run test`
- Contract first REST API design:
  - never break API again with HTTP responses and requests payloads using [type definitions](./src/types/express/index.d.ts)
  - Consistent schema error [response](./src/utils/response/custom-error/types.ts). Your frontend will always know how to handle errors thrown in `try...catch` statements 💪
- JWT authentication and role based authorization using custom middleware
- Set local, stage or production [environmental variables](./config) with [type definitions](./src/types/ProcessEnv.d.ts)
- Logging with [morgan](https://github.com/expressjs/morgan)
- Unit and integration tests with [Mocha](https://mochajs.org/) and [Chai](https://www.chaijs.com/)
- Linting with [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/) code formatter
- Git hooks with [Husky](https://github.com/typicode/husky) and [lint-staged](https://github.com/okonet/lint-staged)
- Automated npm & Docker dependency updates with [Renovate](https://github.com/renovatebot/renovate) (set to patch version only)
- Commit messages must meet [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) format.  
  After staging changes just run `npm run commit` and get instant feedback on your commit message formatting and be prompted for required fields by [Commitizen](https://github.com/commitizen/cz-cli)

## Other awesome boilerplates:

Each boilerplate comes with it's own flavor of libraries and setup, check out others:

- [Express and TypeORM with TypeScript](https://github.com/typeorm/typescript-express-example)
- [Node.js, Express.js & TypeScript Boilerplate for Web Apps](https://github.com/jverhoelen/node-express-typescript-boilerplate)
- [Express boilerplate for building RESTful APIs](https://github.com/danielfsousa/express-rest-es2017-boilerplate)
- [A delightful way to building a RESTful API with NodeJs & TypeScript by @w3tecch](https://github.com/w3tecch/express-typescript-boilerplate)

[build-badge]: https://github.com/mkosir/express-typescript-typeorm-boilerplate/actions/workflows/main.yml/badge.svg
[build-url]: https://github.com/mkosir/express-typescript-typeorm-boilerplate/actions/workflows/main.yml
[typescript-badge]: https://badges.frapsoft.com/typescript/code/typescript.svg?v=101
[typescript-url]: https://github.com/microsoft/TypeScript
[prettier-badge]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg
[prettier-url]: https://github.com/prettier/prettier

## Contributing

All contributions are welcome!
