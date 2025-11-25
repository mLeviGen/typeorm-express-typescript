import { Router } from 'express';
import { checkJwt } from '../../middleware/checkJwt';
import { checkRole } from '../../middleware/checkRole';
import * as c from '../../controllers/catalog/product.controller';  // ← ../../

const r = Router();
r.get('/', c.list);
r.get('/:id(\\d+)', c.show);
r.post('/', [checkJwt, checkRole(['ADMINISTRATOR'])], c.create);
r.put('/:id(\\d+)', [checkJwt, checkRole(['ADMINISTRATOR'])], c.edit);
r.delete('/:id(\\d+)', [checkJwt, checkRole(['ADMINISTRATOR'])], c.destroy);
export default r;
