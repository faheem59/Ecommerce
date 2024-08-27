import Stripe from 'stripe';
import serverConfig from '../config/server-config';

const stripe = new Stripe(serverConfig.STRIPE_SECRET_KEY as string, {
   
});

export const createPaymentIntent = async (amount: number): Promise<Stripe.PaymentIntent> => {
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'usd', 
            payment_method_types: ['card'],
        });
        return paymentIntent;
    } catch (error) {
        console.error('Error creating payment intent:', error);
        throw new Error('Payment Intent creation failed');
    }
};

export const confirmPaymentIntent = async (paymentIntentId: string, paymentMethodId: string): Promise<Stripe.PaymentIntent> => {
    try {
        const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId, {
            payment_method: paymentMethodId,
        });
        return paymentIntent;
    } catch (error) {
        console.error('Error confirming payment intent:', error);
        throw new Error('Payment confirmation failed');
    }
};
