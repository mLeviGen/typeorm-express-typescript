import { Router } from 'express';
import { checkJwt } from '../../middleware/checkJwt';
import { checkRole } from '../../middleware/checkRole';
import { CustomerController } from '../../controllers/customers/customer.controller';
import { validatorCreateCustomer } from '../../middleware/validation/customer/validatorCreateCustomer';
import { validatorUpdateCustomer } from '../../middleware/validation/customer/validatorUpdateCustomer';

const router = Router();
const controller = new CustomerController();
router.get('/', controller.list.bind(controller));
router.get('/:id(\\d+)', controller.get.bind(controller));
router.post('/', [checkJwt, checkRole(['ADMINISTRATOR']), validatorCreateCustomer], controller.create.bind(controller));
router.patch(
  '/:id(\\d+)',
  [checkJwt, checkRole(['ADMINISTRATOR']), validatorUpdateCustomer],
  controller.update.bind(controller),
);
router.delete('/:id(\\d+)', [checkJwt, checkRole(['ADMINISTRATOR'])], controller.delete.bind(controller));
export default router;
