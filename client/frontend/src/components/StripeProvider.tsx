import React, { ReactNode } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';


const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PASS_KEY as string);
console.log(import.meta.env.VITE_STRIPE_PASS_KEY, "Djdjjj");

console.log(stripePromise);

interface StripeProviderProps {
    children: ReactNode;
}

const StripeProvider: React.FC<StripeProviderProps> = ({ children }) => (
    <Elements stripe={stripePromise}>
        {children}
    </Elements>
);

export default StripeProvider;