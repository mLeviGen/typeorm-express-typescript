import { Router } from 'express';
import { checkJwt } from '../../middleware/checkJwt';
import { checkRole } from '../../middleware/checkRole';
import { OrderController } from '../../controllers/orders/order.controller';
import { validatorCreateOrder } from '../../middleware/validation/order/validatorCreateOrder';
import { validatorUpdateOrder } from '../../middleware/validation/order/validatorUpdateOrder';

const router = Router();
const controller = new OrderController();
router.get('/', controller.list.bind(controller));   
router.get('/:id(\\d+)', controller.get.bind(controller));
router.post('/', [checkJwt, validatorCreateOrder], controller.create.bind(controller));
router.patch(
  '/:id(\\d+)',
  [checkJwt, checkRole(['ADMINISTRATOR']), validatorUpdateOrder],
  controller.update.bind(controller),
);
router.delete('/:id(\\d+)', [checkJwt, checkRole(['ADMINISTRATOR'])], controller.delete.bind(controller));
export default router;
