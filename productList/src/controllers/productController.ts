import { Request, Response } from 'express';
import Product from '../models/productModels';
import httpStatus from 'http-status';
import message from '../utils/message';

export const addProduct = async (req: Request, res: Response) => {
    const { name, price, description, image, stock } = req.body
    try {
        const newProduct = new Product({
            name,
            price,
            description,
            image,
            stock,
        });

        const savedProduct = await newProduct.save();
        res.status(httpStatus.CREATED).json({ message: message.USER_CREATED, savedProduct })
    } catch (error) {
        console.error('Error adding product:', error);
    }
};


export const getProduct = async (req: Request, res: Response) => {
    try {
        const products = await Product.find({});
        res.status(httpStatus.OK).json({ message: message.USER_CREATED, products })
    } catch (error) {
        console.error('Error retrieving products:', error);
    }
}




