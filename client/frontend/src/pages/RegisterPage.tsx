// RegisterForm.tsx
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { TextField, Button, Container, Typography, CardContent, Card } from '@mui/material';
import { registrationSchema } from '../utils/validationSchema';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

interface FormValues {
    username: string;
    email: string;
    password: string;
}

const RegisterForm: React.FC = () => {

    const navigate = useNavigate();
    const { control, handleSubmit, formState: { errors } } = useForm<FormValues>({
        resolver: yupResolver(registrationSchema),
    });

    const onSubmit = async (data: FormValues) => {
        try {
            const response = await axios.post('http://localhost:5000/api/register', data);
            if (response.status === 201) {
                toast.success(`User ${response.data.username} registered successfully!`);
                navigate('/login')
            } else {
                toast.error('Registration failed.');
            }
        } catch (error) {
            toast.error('Registration failed. Please try again.');
            console.error('Registration error:', error);
        }
    };

    return (
        <Container maxWidth="xs">
            <Card>
                <CardContent>
                    <Typography variant="h4" gutterBottom align="center">
                        Register
                    </Typography>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Controller
                            name="username"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Username"
                                    fullWidth
                                    margin="normal"
                                    error={!!errors.username}
                                    helperText={errors.username?.message}
                                />
                            )}
                        />
                        <Controller
                            name="email"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Email"
                                    type="email"
                                    fullWidth
                                    margin="normal"
                                    error={!!errors.email}
                                    helperText={errors.email?.message}
                                />
                            )}
                        />
                        <Controller
                            name="password"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Password"
                                    type="password"
                                    fullWidth
                                    margin="normal"
                                    error={!!errors.password}
                                    helperText={errors.password?.message}
                                />
                            )}
                        />
                        <Button type="submit" variant="contained" color="primary" fullWidth>
                            Register
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </Container>
    );
};

export default RegisterForm;
