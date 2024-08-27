import { Router } from 'express';
import { addProduct, getProduct } from '../controllers/productController';
const router: Router = Router();


router.post('/addproduct', addProduct);
router.get('/product', getProduct);

export default router;