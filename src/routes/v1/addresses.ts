import { Router } from 'express';
import { checkJwt } from '../../middleware/checkJwt';
import { checkRole } from '../../middleware/checkRole';
import { AddressController } from '../../controllers/addresses/address.controller';
import { validatorCreateAddress } from '../../middleware/validation/address/validatorCreateAddress';
import { validatorUpdateAddress } from '../../middleware/validation/address/validatorUpdateAddress';

const router = Router();
const controller = new AddressController();
router.get('/', controller.list.bind(controller));
router.get('/:id(\\d+)', controller.get.bind(controller));
router.post('/', [checkJwt, checkRole(['ADMINISTRATOR']), validatorCreateAddress], controller.create.bind(controller));
router.patch(
  '/:id(\\d+)',
  [checkJwt, checkRole(['ADMINISTRATOR']), validatorUpdateAddress],
  controller.update.bind(controller),
);
router.delete('/:id(\\d+)', [checkJwt, checkRole(['ADMINISTRATOR'])], controller.delete.bind(controller));
export default router;