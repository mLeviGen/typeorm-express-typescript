import { Router } from 'express';
import auth from './auth';
import users from './users';
import products from './products';
import customers from './customers';
import addresses from './addresses';
import orders from './orders';

const r = Router();
r.use('/auth', auth);
r.use('/users', users);
r.use('/products', products);
r.use('/customers', customers);
r.use('/addresses', addresses);
r.use('/orders', orders);

export default r;
