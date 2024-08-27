import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { Box, Button, Paper, Typography } from '@mui/material';

const PaymentForm: React.FC = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const token = useSelector((state: RootState) => state.auth.token);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) {
            setError('Stripe.js has not loaded yet.');
            return;
        }

        const cardElement = elements.getElement(CardElement);

        if (!cardElement) {
            setError('Card element not found');
            return;
        }

        const { error: createPaymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
        });

        if (createPaymentMethodError) {
            setError(createPaymentMethodError.message || 'Failed to create payment method');
            return;
        }

        if (!paymentMethod) {
            setError('No payment method returned');
            return;
        }

        try {
            const response = await fetch('http://localhost:5002/api/process-payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    orderId,
                    paymentMethodId: paymentMethod.id,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                setSuccess(`Payment successful! Payment ID: ${result.paymentId}`);
            } else {
                setError(result.message || 'Payment failed.');
            }
        } catch (err) {
            setError('Payment processing error.');
        }
    };

    return (
        <>
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    maxWidth: 500,
                    margin: '0 auto',
                    padding: 3,
                    borderRadius: 2,
                    boxShadow: 3,
                    backgroundColor: '#fff',
                    marginTop: '100px'
                }}
            >
                <Paper elevation={1} sx={{ padding: 2, borderRadius: 2, marginBottom: 3 }}>
                    <CardElement
                        options={{
                            style: {
                                base: {
                                    fontSize: '16px',
                                    color: '#424770',
                                    '::placeholder': {
                                        color: '#aab7c4',
                                    },
                                },
                                invalid: {
                                    color: '#9e2146',
                                },
                            },
                        }}
                    />
                </Paper>

                {error && (
                    <Typography variant="body2" color="error" sx={{ marginTop: 2 }}>
                        {error}
                    </Typography>
                )}

                {success && (
                    <Typography variant="body2" color="success.main" sx={{ marginTop: 2 }}>
                        {success}
                    </Typography>
                )}

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ marginTop: 3 }}
                    disabled={!stripe}
                >
                    Pay
                </Button>
            </Box>
        </>
    );
};

export default PaymentForm;
