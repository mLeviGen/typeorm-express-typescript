import { Router } from 'express';
import { checkJwt } from '../../middleware/checkJwt';
import { checkRole } from '../../middleware/checkRole';
import * as c from '../../controllers/orders/order.controller'; // если файл у тебя так называется

const r = Router();
r.get('/', c.list);                  // внутри сервиса relations: ['customer','items','items.product']
r.get('/:id(\\d+)', c.show);
r.post('/', [checkJwt], c.create);   // оформить заказ — авторизованный
r.put('/:id(\\d+)', [checkJwt, checkRole(['ADMINISTRATOR'])], c.edit);
r.delete('/:id(\\d+)', [checkJwt, checkRole(['ADMINISTRATOR'])], c.destroy);
export default r;
