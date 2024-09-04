import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Paper, Box } from '@mui/material';
import axios from 'axios';

const AddProductForm = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [stock, setStock] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            const response = await axios.post('http://localhost:5006/api/addproduct', {
                name,
                price,
                description,
                image,
                stock,
            });
            setSuccess('Product added successfully!');
            setError('');
            setName('');
            setPrice('');
            setDescription('');
            setImage('');
            setStock('');
        } catch (error) {
            setError('Failed to add product.');
            setSuccess('');
            console.error('Error adding product:', error);
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ padding: 3, marginTop: 5 }}>
                <Typography variant="h4" gutterBottom>
                    Add Product
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Box mb={2}>
                        <TextField
                            fullWidth
                            label="Product Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </Box>
                    <Box mb={2}>
                        <TextField
                            fullWidth
                            label="Price"
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                        />
                    </Box>
                    <Box mb={2}>
                        <TextField
                            fullWidth
                            label="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </Box>
                    <Box mb={2}>
                        <TextField
                            fullWidth
                            label="Image URL"
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                            required
                        />
                    </Box>
                    <Box mb={2}>
                        <TextField
                            fullWidth
                            label="Stock"
                            type="number"
                            value={stock}
                            onChange={(e) => setStock(e.target.value)}
                            required
                        />
                    </Box>
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        Add Product
                    </Button>
                    {error && (
                        <Typography color="error" variant="body2" sx={{ marginTop: 2 }}>
                            {error}
                        </Typography>
                    )}
                    {success && (
                        <Typography color="success.main" variant="body2" sx={{ marginTop: 2 }}>
                            {success}
                        </Typography>
                    )}
                </form>
            </Paper>
        </Container>
    );
};

export default AddProductForm;
