import mongoose, { Document, Schema } from 'mongoose';

interface IProduct extends Document {
    name: string;
    price: number;
    description?: string;
    image?: string;
    stock: number;
}


const productSchema: Schema = new Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    image: {
        type: String,
        default: ''
    },
    stock: {
        type: Number,
        required: true
    }
}, {
    timestamps: true,
});

const Product = mongoose.model<IProduct>('Product', productSchema);

export default Product;
