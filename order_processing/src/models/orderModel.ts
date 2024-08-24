import mongoose, { Document, Schema } from 'mongoose';

interface IItem {
    name: string;
    quantity: number;
}

interface IOrder extends Document {
    orderId: string;
    userId: string;
    items: IItem[];
    totalPrice: number;
    status: 'pending' | 'fulfilled' | 'failed';
}

const itemSchema: Schema = new Schema({
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
});

const orderSchema: Schema = new Schema({
    orderId: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    items: [itemSchema],
    totalPrice: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'fulfilled', 'failed'], default: 'pending' },
}, {
    timestamps: true,
});

const Order = mongoose.model<IOrder>('Order', orderSchema);

export default Order;
