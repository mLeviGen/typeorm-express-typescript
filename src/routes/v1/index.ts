import { Router } from 'express';
import auth from './auth';
import users from './users';
import products from './products';
import customers from './customers';
import addresses from './addresses';
import orders from './orders';

const router = Router();
router.use('/auth', auth);
router.use('/users', users);
router.use('/products', products);
router.use('/customers', customers);
router.use('/addresses', addresses);
router.use('/orders', orders);

export default router;