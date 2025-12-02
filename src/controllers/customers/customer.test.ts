import 'mocha';
import { expect } from 'chai';
import { agent as request } from 'supertest';
import { getRepository, Connection, Repository } from 'typeorm';

import { dbCreateConnection } from '../../../orm/dbCreateConnection';
import { Customer } from '../../../orm/entities/Customer';
import { Address } from '../../../orm/entities/Address';
import { User } from '../../../orm/entities/users/User';
import { Role } from '../../../orm/entities/users/types';
import { app } from '../../index';

describe('Customer Controller', () => {
  let dbConnection: Connection;
  let customerRepo: Repository<Customer>;
  let addressRepo: Repository<Address>;
  let userRepo: Repository<User>;
  
  let token: string;
  let testUser: User;

  let testAddress: Address;
  let createdCustomer: Customer;

  before(async () => {
    try {
      dbConnection = await dbCreateConnection();
    } catch (e) {
      dbConnection = getRepository(Customer).manager.connection;
    }
    customerRepo = getRepository(Customer);
    addressRepo = getRepository(Address);
    userRepo = getRepository(User);

    testUser = new User();
    testUser.username = 'TestAdminCustomer';
    testUser.name = 'Test Admin Cust';
    testUser.email = 'admin.customer@test.com';
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
      city: 'Cust City', address: 'Cust St', country: 'Custland'
    }));

    createdCustomer = await customerRepo.save(customerRepo.create({
      name: 'Test Customer',
      phone: '555-0100',
      address: testAddress
    }));
  });

  afterEach(async () => {
    if (createdCustomer && createdCustomer.id) {
      await customerRepo.delete(createdCustomer.id);
    }
    if (testAddress && testAddress.id) {
      await addressRepo.delete(testAddress.id);
    }
  });

  it('GET /v1/customers - should return list of customers', async () => {
    const res = await request(app).get('/v1/customers');
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
    
    const found = res.body.find((c: Customer) => c.id === createdCustomer.id);
    expect(found).to.exist;
    expect(found.name).to.equal('Test Customer');
    expect(found.address).to.exist;
    expect(found.address.id).to.equal(testAddress.id);
  });

  it('GET /v1/customers/:id - should return one customer', async () => {
    const res = await request(app).get(`/v1/customers/${createdCustomer.id}`);
    expect(res.status).to.equal(200);
    expect(res.body.id).to.equal(createdCustomer.id);
    expect(res.body.address.id).to.equal(testAddress.id);
  });

  it('POST /v1/customers - should create a new customer', async () => {
    const newCustomerData = {
      name: 'New Client',
      phone: '999-0000',
      address: testAddress.id
    };

    const res = await request(app)
      .post('/v1/customers')
      .set('Authorization', token)
      .send(newCustomerData);
    
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('id');
    expect(res.body.name).to.equal(newCustomerData.name);

    await customerRepo.delete(res.body.id);
  });

  it('PATCH /v1/customers/:id - should update customer phone', async () => {
    const updateData = {
      phone: '111-2222'
    };

    const res = await request(app)
      .patch(`/v1/customers/${createdCustomer.id}`)
      .set('Authorization', token)
      .send(updateData);
    
    expect(res.status).to.equal(200);
    expect(res.body.phone).to.equal('111-2222');
  });

  it('DELETE /v1/customers/:id - should delete customer', async () => {
    const tempCustomer = await customerRepo.save(customerRepo.create({
      name: 'To Delete', phone: '000', address: testAddress
    }));

    const res = await request(app)
      .delete(`/v1/customers/${tempCustomer.id}`)
      .set('Authorization', token);
      
    expect(res.status).to.equal(204);

    const check = await customerRepo.findOne({ where: { id: tempCustomer.id } });
    expect(check).to.be.null;
  });
});