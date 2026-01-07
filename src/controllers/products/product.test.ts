import 'mocha';
import { expect } from 'chai';
import { agent as request } from 'supertest';
import { getRepository, Connection, Repository } from 'typeorm';

import { dbCreateConnection } from '../../orm/dbCreateConnection';
import { CheeseProduct } from '../../orm/entities/CheeseProduct';
import { User } from '../../orm/entities/users/User';
import { Role } from '../../orm/entities/users/types';
import { app } from '../../index';

describe('Products Controller', () => {
  let dbConnection: Connection;
  let productRepo: Repository<CheeseProduct>;
  let userRepo: Repository<User>;
  
  let token: string;
  let testUser: User;

  const testProductData = {
    name: 'Test Cheddar',
    cheeseType: 'Hard',
    basePrice: '150.00', 
    isActive: true,
  };

  let createdProduct: CheeseProduct;

  before(async () => {
    try {
      dbConnection = await dbCreateConnection();
    } catch (e) {
      dbConnection = getRepository(CheeseProduct).manager.connection;
    }
    productRepo = getRepository(CheeseProduct);
    userRepo = getRepository(User);

    testUser = new User();
    testUser.username = 'TestAdminProducts';
    testUser.name = 'Test Admin';
    testUser.email = 'admin.products@test.com';
    testUser.password = 'pass1';
    testUser.hashPassword();
    testUser.role = 'ADMINISTRATOR' as Role;
    await userRepo.save(testUser);

    const authRes = await request(app).post('/v1/auth/login').send({
      email: testUser.email,
      password: 'pass1',
    });
    
    token = authRes.body.data; 
  });

  after(async () => {
    if (testUser) await userRepo.delete(testUser.id);
  });

  beforeEach(async () => {
    const product = productRepo.create(testProductData);
    createdProduct = await productRepo.save(product);
  });

  afterEach(async () => {
    if (createdProduct && createdProduct.id) {
      await productRepo.delete(createdProduct.id);
    }
  });

  it('GET /v1/products - should return list of products', async () => {
    const res = await request(app).get('/v1/products');
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
    const found = res.body.find((p: any) => p.id === createdProduct.id);
    expect(found).to.not.be.undefined;
    expect(found.title).to.equal(testProductData.name);
  });

  it('GET /v1/products/:id - should return one product', async () => {
    const res = await request(app).get(`/v1/products/${createdProduct.id}`);
    expect(res.status).to.equal(200);
    expect(res.body.id).to.equal(createdProduct.id);
    expect(res.body.title).to.equal(testProductData.name);
  });

  it('POST /v1/products - should create a new product', async () => {
    const newProductData = {
      name: 'New Test Brie',
      cheeseType: 'Soft',
      basePrice: 200.50, 
      isActive: true,
    };

    const res = await request(app)
      .post('/v1/products')
      .set('Authorization', token)
      .send(newProductData);
    
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('id');
    expect(res.body.title).to.equal(newProductData.name);

    await productRepo.delete(res.body.id);
  });

  it('PATCH /v1/products/:id - should update product price', async () => {
    const updateData = {
      basePrice: 999.00
    };

    const res = await request(app)
      .patch(`/v1/products/${createdProduct.id}`)
      .set('Authorization', token)
      .send(updateData);
    
    expect(res.status).to.equal(200);
    expect(Number(res.body.cost)).to.equal(999.00);
  });

  it('DELETE /v1/products/:id - should delete product', async () => {
    const tempProduct = await productRepo.save(productRepo.create({
      name: 'To Delete', cheeseType: 'N/A', basePrice: '10', isActive: false
    }));

    const res = await request(app)
      .delete(`/v1/products/${tempProduct.id}`)
      .set('Authorization', token); 
      
    expect(res.status).to.equal(204);

    const check = await productRepo.findOne({ where: { id: tempProduct.id } });
    expect(check).to.be.null;
  });
});