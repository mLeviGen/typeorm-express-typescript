import 'mocha';
import { expect } from 'chai';
import { agent as request } from 'supertest';
import { getRepository, Connection, Repository } from 'typeorm';

import { dbCreateConnection } from '../../../orm/dbCreateConnection';
import { Address } from '../../../orm/entities/Address';
import { User } from '../../../orm/entities/users/User';
import { Role } from '../../../orm/entities/users/types';
import { app } from '../../index';

describe('Address Controller', () => {
  let dbConnection: Connection;
  let addressRepo: Repository<Address>;
  let userRepo: Repository<User>;
  
  let token: string;
  let testUser: User;

  const testAddressData = {
    city: 'Test City',
    address: '123 Test St',
    country: 'Testland',
  };

  let createdAddress: Address;

  before(async () => {
    try {
      dbConnection = await dbCreateConnection();
    } catch (e) {
      dbConnection = getRepository(Address).manager.connection;
    }
    addressRepo = getRepository(Address);
    userRepo = getRepository(User);

    testUser = new User();
    testUser.username = 'TestAdminAddress';
    testUser.name = 'Test Admin Addr';
    testUser.email = 'admin.address@test.com';
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
    createdAddress = await addressRepo.save(addressRepo.create(testAddressData));
  });

  afterEach(async () => {
    if (createdAddress && createdAddress.id) {
      await addressRepo.delete(createdAddress.id);
    }
  });

  it('GET /v1/addresses - should return list of addresses', async () => {
    const res = await request(app).get('/v1/addresses');
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
    const found = res.body.find((a: Address) => a.id === createdAddress.id);
    expect(found).to.exist;
    expect(found.city).to.equal(testAddressData.city);
  });

  it('GET /v1/addresses/:id - should return one address', async () => {
    const res = await request(app).get(`/v1/addresses/${createdAddress.id}`);
    expect(res.status).to.equal(200);
    expect(res.body.id).to.equal(createdAddress.id);
  });

  it('POST /v1/addresses - should create a new address', async () => {
    const newAddressData = {
      city: 'New York',
      address: '5th Avenue',
      country: 'USA'
    };

    const res = await request(app)
      .post('/v1/addresses')
      .set('Authorization', token)
      .send(newAddressData);
    
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('id');
    expect(res.body.city).to.equal(newAddressData.city);

    await addressRepo.delete(res.body.id);
  });

  it('PATCH /v1/addresses/:id - should update address', async () => {
    const updateData = {
      city: 'Updated City'
    };

    const res = await request(app)
      .patch(`/v1/addresses/${createdAddress.id}`)
      .set('Authorization', token)
      .send(updateData);
    
    expect(res.status).to.equal(200);
    expect(res.body.city).to.equal('Updated City');
  });

  it('DELETE /v1/addresses/:id - should delete address', async () => {
    const tempAddress = await addressRepo.save(addressRepo.create({
      city: 'Delete Me', address: 'Nowhere', country: 'Void'
    }));

    const res = await request(app)
      .delete(`/v1/addresses/${tempAddress.id}`)
      .set('Authorization', token);
      
    expect(res.status).to.equal(204);

    const check = await addressRepo.findOne({ where: { id: tempAddress.id } });
    expect(check).to.be.null;
  });
});