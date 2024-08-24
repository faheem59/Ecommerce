// src/models/paymentModel.ts

import mongoose, { Document, Schema } from 'mongoose';

interface IPayment extends Document {
    paymentId: string;
    orderId: string;
    userId: string;
    amount: number;
    status: 'success' | 'failure';
    createdAt?: Date;
    updatedAt?: Date;
}

const PaymentSchema: Schema = new Schema({
    paymentId: {
        type: String,
        required: true
    },
    orderId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['success', 'failure'],
        required: true
    }
}, { timestamps: true });

const Payment = mongoose.model<IPayment>('Payment', PaymentSchema);

export default Payment;
