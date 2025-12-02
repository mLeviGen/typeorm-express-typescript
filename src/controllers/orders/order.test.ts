import 'mocha';
import { expect } from 'chai';
import { agent as request } from 'supertest';
import { getRepository, Connection, Repository } from 'typeorm';

// Відносні шляхи для стабільності тестів
import { dbCreateConnection } from '../../../orm/dbCreateConnection';
import { app } from '../../index'; 

import { CustomerOrder } from '../../../orm/entities/CustomerOrder';
import { Customer } from '../../../orm/entities/Customer';
import { Address } from '../../../orm/entities/Address';
import { CheeseProduct } from '../../../orm/entities/CheeseProduct';
import { User } from '../../../orm/entities/users/User';
import { Role } from '../../../orm/entities/users/types';

describe('Order Controller', () => {
  let dbConnection: Connection;
  
  let orderRepo: Repository<CustomerOrder>;
  let customerRepo: Repository<Customer>;
  let addressRepo: Repository<Address>;
  let productRepo: Repository<CheeseProduct>;
  let userRepo: Repository<User>;

  let testAddress: Address;
  let testCustomer: Customer;
  let testProduct: CheeseProduct;
  let createdOrder: CustomerOrder;
  
  let token: string;
  let testUser: User;

  before(async () => {
    try {
      dbConnection = await dbCreateConnection();
    } catch (e) {
      dbConnection = getRepository(CustomerOrder).manager.connection;
    }
    orderRepo = getRepository(CustomerOrder);
    customerRepo = getRepository(Customer);
    addressRepo = getRepository(Address);
    productRepo = getRepository(CheeseProduct);
    userRepo = getRepository(User);

    testUser = new User();
    testUser.username = 'TestAdminOrders';
    testUser.name = 'Test Admin Orders';
    testUser.email = 'admin.orders@test.com';
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
    testAddress = await addressRepo.save(addressRepo.create({
      city: 'Order City', address: 'Order St', country: 'Orderland'
    }));

    testCustomer = await customerRepo.save(customerRepo.create({
      name: 'Order Buyer', phone: '1234567890', address: testAddress
    }));

    testProduct = await productRepo.save(productRepo.create({
      name: 'Order Cheese', cheeseType: 'Test', basePrice: '100.00', isActive: true
    }));

    createdOrder = await orderRepo.save(orderRepo.create({
      customer: testCustomer,
      status: 'NEW'
    }));
  });

  afterEach(async () => {
    if (createdOrder) await orderRepo.delete(createdOrder.id);
    if (testCustomer) await customerRepo.delete(testCustomer.id);
    if (testProduct) await productRepo.delete(testProduct.id);
    if (testAddress) await addressRepo.delete(testAddress.id);
  });

  it('GET /v1/orders - should return list of orders', async () => {
    const res = await request(app)
      .get('/v1/orders')
      .set('Authorization', token);

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
    
    const found = res.body.find((o: CustomerOrder) => o.id === createdOrder.id);
    expect(found).to.exist;
    expect(found.customer).to.exist;
    expect(found.customer.id).to.equal(testCustomer.id);
  });

  it('GET /v1/orders/:id - should return one order', async () => {
    const res = await request(app)
      .get(`/v1/orders/${createdOrder.id}`)
      .set('Authorization', token);

    expect(res.status).to.equal(200);
    expect(res.body.id).to.equal(createdOrder.id);
    expect(res.body.status).to.equal('NEW');
  });

  it('POST /v1/orders - should create order with items', async () => {
    const orderData = {
      customerId: testCustomer.id,
      status: 'NEW',
      items: [
        {
          productId: testProduct.id,
          quantity: 5,
          unitPrice: 100.00
        }
      ]
    };

    const res = await request(app)
      .post('/v1/orders')
      .set('Authorization', token)
      .send(orderData);
    
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('id');
    expect(res.body.customer.id).to.equal(testCustomer.id);
    
    expect(res.body.items).to.be.an('array');
    expect(res.body.items).to.have.lengthOf(1);
    expect(res.body.items[0].quantity).to.equal(5);

    await orderRepo.delete(res.body.id);
  });

  it('PATCH /v1/orders/:id - should update order status', async () => {
    const updateData = {
      status: 'SHIPPED'
    };

    const res = await request(app)
      .patch(`/v1/orders/${createdOrder.id}`)
      .set('Authorization', token)
      .send(updateData);
    
    expect(res.status).to.equal(200);
    expect(res.body.status).to.equal('SHIPPED');
  });

  it('DELETE /v1/orders/:id - should delete order', async () => {
    const tempOrder = await orderRepo.save(orderRepo.create({
        customer: testCustomer,
        status: 'CANCELLED'
    }));

    const res = await request(app)
      .delete(`/v1/orders/${tempOrder.id}`)
      .set('Authorization', token);
      
    expect(res.status).to.equal(204);

    const check = await orderRepo.findOne({ where: { id: tempOrder.id } });
    expect(check).to.be.null;
  });
});