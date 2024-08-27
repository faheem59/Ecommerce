// src/pages/Payment/Payment.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';
import { RootState } from '../../redux/store';
import { useSelector } from 'react-redux';

const Payment: React.FC = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const [loading, setLoading] = useState<boolean>(true);
    const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const token = useSelector((store: RootState) => store.auth.token);

    useEffect(() => {
        const processPayment = async () => {
            try {
                const response = await axios.post('http://localhost:5002/api/process-payment', {
                    orderId,
                }, {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                setPaymentStatus(`Payment Status: ${response.data.status}`);
            } catch (err) {
                console.error('Error processing payment:', err);
                setError('Failed to process payment. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        processPayment();
    }, [orderId]);

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Payment
            </Typography>
            {loading && <CircularProgress />}
            {error && <Alert severity="error">{error}</Alert>}
            {paymentStatus && <Typography variant="h6">{paymentStatus}</Typography>}
        </Container>
    );
};

export default Payment;
