import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    List,
    ListItem,
    ListItemText,
    Button,
    CircularProgress,
    Alert,
    IconButton,
    TextField,
    Box
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { RootState } from '../../redux/store';
import { clearCart, updateQuantity } from '../../redux/cartSlice';
import { Add, Remove } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Cart: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cartItems = useSelector((state: RootState) => state.cart.items);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [orderId, setOrderId] = useState<string | null>(null);
    const token = useSelector((store: RootState) => store.auth.token);

    const getTotalPrice = () => cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    const handleQuantityChange = (name: string, newQuantity: number) => {
        if (newQuantity < 1) {
            dispatch(updateQuantity({ name, quantity: 0 }));
        } else {
            dispatch(updateQuantity({ name, quantity: newQuantity }));
        }
    };

    const handleOrder = async () => {
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await axios.post('http://localhost:5003/api/orders', {
                items: cartItems.map(item => ({
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity
                }))
            }, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log('Order response:', response.data); // Debugging line
            if (response.status === 201) {
                setOrderId(response.data.orderId); // Save the orderId
                setSuccess(`Order created successfully! Order ID: ${response.data.orderId}`);
                dispatch(clearCart());
            }
        } catch (err) {
            console.error('Error creating order:', err);
            setError('Failed to create order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        console.log('Current orderId:', orderId);
    }, [orderId]);

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Cart
            </Typography>
            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}
            {loading && <CircularProgress />}
            {orderId && (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate(`/payment/${orderId}`)}
                    style={{ marginTop: '1rem' }}
                >
                    Proceed to Payment
                </Button>
            )}
            {cartItems.length === 0 ? (
                <Typography>Your cart is empty</Typography>

            ) : (
                <>
                    <List>
                        {cartItems.map((item, index) => (
                            <ListItem key={index}>
                                <ListItemText
                                    primary={item.name}
                                    secondary={`Price: $${item.price}`}
                                />
                                <Box display="flex" alignItems="center">
                                    <IconButton
                                        onClick={() => handleQuantityChange(item.name, item.quantity - 1)}
                                        disabled={item.quantity <= 1}
                                    >
                                        <Remove />
                                    </IconButton>
                                    <TextField
                                        value={item.quantity}
                                        type="number"
                                        inputProps={{ min: 1 }}
                                        onChange={(e) => handleQuantityChange(item.name, parseInt(e.target.value))}
                                        style={{ width: '50px', textAlign: 'center' }}
                                    />
                                    <IconButton
                                        onClick={() => handleQuantityChange(item.name, item.quantity + 1)}
                                    >
                                        <Add />
                                    </IconButton>
                                </Box>
                            </ListItem>
                        ))}
                    </List>
                    <Typography variant="h6">Total: ${getTotalPrice()}</Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleOrder}
                        disabled={loading}
                    >
                        {loading ? 'Placing Order...' : 'Place Order'}
                    </Button>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => dispatch(clearCart())}
                        style={{ marginLeft: '1rem' }}
                    >
                        Clear Cart
                    </Button>

                </>
            )}
        </Container>
    );
};

export default Cart;
