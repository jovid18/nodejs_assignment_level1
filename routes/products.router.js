import express from 'express';
import productController from '../controllers/products.controller.js';

const router = express.Router();

router.post('/products', productController.createProduct);
router.get('/products', productController.getAllProducts);
router.get('/products/:productId', productController.getProductById);
router.patch('/products/:productId', productController.updateProduct);
router.delete('/products/:productId', productController.deleteProduct);

export default router;
