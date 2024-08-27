// src/pages/Product/ProductList.tsx
import React, { useEffect, useState } from 'react';
import { Container, Typography, Card, CardContent, Grid, Button } from '@mui/material';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addItem } from '../../redux/cartSlice';
import { useNavigate } from 'react-router-dom';



export interface IProduct {
    name: string;
    price: number;
    description?: string;
    image?: string;
    stock: number;
    quatity: number;
}

const ProductList: React.FC = () => {

    const [products, setProducts] = useState<IProduct[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:5006/api/product');
                setProducts(response.data.products);


            } catch (error) {
                setError('Error fetching products');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) return <Typography>Loading...</Typography>;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Product List
            </Typography>
            <Grid container spacing={2}>
                {products.map((product, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card>
                            {product.image && <img src={product.image} alt={product.name} style={{ width: '100%' }} />}
                            <CardContent>
                                <Typography variant="h6">{product.name}</Typography>
                                <Typography variant="body1">Price: ${product.price}</Typography>
                                <Typography variant="body2">Stock: {product.stock}</Typography>
                                {product.description && <Typography variant="body2">{product.description}</Typography>}
                            </CardContent>
                            <Button onClick={() => dispatch(addItem({
                                name: product.name,
                                price: product.price,
                                quantity: 1
                            }))}
                            >Add to Cart</Button>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default ProductList;
