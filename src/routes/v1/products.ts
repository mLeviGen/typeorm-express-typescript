import { Router } from 'express';
import { ProductController } from '../../controllers/products/product.controller';
import { validatorCreateProduct } from '../../middleware/validation/product/validatorCreateProduct';

const router = Router();
const controller = new ProductController();

router.get('/', controller.list.bind(controller));
router.get('/:id', controller.get.bind(controller));

router.post('/', [validatorCreateProduct], controller.create.bind(controller));

router.patch('/:id', controller.update.bind(controller)); 
router.delete('/:id', controller.delete.bind(controller));

export default router;