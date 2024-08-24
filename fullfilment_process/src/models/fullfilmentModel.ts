import mongoose, { Document, Schema } from 'mongoose';

interface IFulfillment extends Document {
    fulfillmentId: string;
    orderId: string;
    status: string;
}

const fulfillmentSchema: Schema = new Schema({
    fulfillmentId: { type: String, required: true, unique: true },
    orderId: { type: String, required: true },
    status: { type: String, required: true, default: 'pending' },
}, {
    timestamps: true,
});


const Fulfillment = mongoose.model<IFulfillment>('Fulfillment', fulfillmentSchema);

export default Fulfillment;
