import React, { ReactNode } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import dotenv from "dotenv"

dotenv.config();

const stripePromise = loadStripe(process.env.STRIPE_PASS_KEY as string);

interface StripeProviderProps {
    children: ReactNode;
}

const StripeProvider: React.FC<StripeProviderProps> = ({ children }) => (
    <Elements stripe={stripePromise}>
        {children}
    </Elements>
);

export default StripeProvider;