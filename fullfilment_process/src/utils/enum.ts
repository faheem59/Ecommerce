import { OrderStatus } from "../types/interface";

export default {
    FULFILMENT_STATUS: "fulfillment.status",
    PAYMENT_STATUS: 'payment.status',
    SUCCESS: 'success' as OrderStatus,
    FULFILLED: 'fulfilled' as OrderStatus,
    FAILED: 'failed' as OrderStatus
}