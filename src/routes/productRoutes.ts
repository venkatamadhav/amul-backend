import { Router } from 'express';
import { getAllProducts, getProductById, refreshProducts } from '@/controllers/productController';

const router = Router();

/**
 * @route   GET /api/products
 * @desc    Get all products
 * @access  Public
 */
router.get('/', getAllProducts);

/**
 * @route   GET /api/products/:id
 * @desc    Get single product by ID
 * @access  Public
 */
router.get('/:id', getProductById);

/**
 * @route   POST /api/products/refresh
 * @desc    Manually refresh products from API
 * @access  Public
 */
router.post('/refresh', refreshProducts);

export default router;