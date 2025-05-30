import { Request, Response } from 'express';
import { Product } from '@/models/Product';
import { fetchAndUpdateProducts } from '@/services/productService';
import { ApiResponse } from '@/types';

export const getAllProducts = async (_req: Request, res: Response): Promise<void> => {
  try {
    const products = await Product.find().sort({ name: 1 });
    
    const response: ApiResponse = {
      success: true,
      data: products
    };
    
    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
    res.status(500).json(response);
  }
};

export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findOne({ productId: req.params.id });
    
    if (!product) {
      const response: ApiResponse = {
        success: false,
        error: 'Product not found'
      };
      res.status(404).json(response);
      return;
    }
    
    const response: ApiResponse = {
      success: true,
      data: product
    };
    
    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
    res.status(500).json(response);
  }
};

export const refreshProducts = async (_req: Request, res: Response): Promise<void> => {
  try {
    await fetchAndUpdateProducts();
    
    const response: ApiResponse = {
      success: true,
      message: 'Products refreshed successfully'
    };
    
    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
    res.status(500).json(response);
  }
};