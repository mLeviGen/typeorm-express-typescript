import { Router } from 'express';
import { ProductController } from '../../controllers/products/product.controller';
import { validatorCreateProduct } from '../../middleware/validation/product/validatorCreateProduct';
import { validatorUpdateProduct } from '../../middleware/validation/product/validatorUpdateProduct';
import { checkJwt } from '../../middleware/checkJwt';
import { checkRole } from '../../middleware/checkRole';

const router = Router();
const controller = new ProductController();

router.get('/', controller.list.bind(controller));
router.get('/:id(\\d+)', controller.get.bind(controller));

router.post('/', [checkJwt, checkRole(['ADMINISTRATOR']), validatorCreateProduct], controller.create.bind(controller));

router.patch(
  '/:id(\\d+)',
  [checkJwt, checkRole(['ADMINISTRATOR']), validatorUpdateProduct],
  controller.update.bind(controller),
);

router.delete('/:id(\\d+)', [checkJwt, checkRole(['ADMINISTRATOR'])], controller.delete.bind(controller));

export default router;