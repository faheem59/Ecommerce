

import mongoose, { Document, Schema } from 'mongoose';

interface IOrder extends Document {
    orderId: string;
    userId: string;
    items: any[];
    totalPrice: number;
    status: 'pending' | 'fulfilled' | 'failed';
    createdAt?: Date;
    updatedAt?: Date;
}

const OrderSchema: Schema = new Schema({
    orderId: { type: String, required: true },
    userId: { type: String, required: true },
    items: { type: Array, required: true },
    totalPrice: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'fulfilled', 'failed'], default: 'pending' },
}, { timestamps: true });

const Order = mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
