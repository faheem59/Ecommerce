import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { TextField, Button, Card, CardContent, Typography, Container } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { setAuthToken } from '../redux/authSlice';
import { loginSchema } from '../utils/validationSchema';
import { useNavigate } from 'react-router-dom';


interface LoginFormValues {
    email: string;
    password: string;
}


const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { control, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
        resolver: yupResolver(loginSchema),
    });
    const dispatch = useDispatch();

    const onSubmit = async (data: LoginFormValues) => {
        try {
            const response = await axios.post('http://localhost:5000/api/login', data);
            if (response.status === 200) {
                toast.success('Login successful!');
                dispatch(setAuthToken(response.data.token));
                navigate('/');
            } else {
                toast.error('Login failed.');
            }
        } catch (error) {
            toast.error('Login failed. Please try again.');
            console.error('Login error:', error);
        }
    };

    return (
        <Container maxWidth="xs">
            <Card>
                <CardContent>
                    <Typography variant="h4" gutterBottom align="center">
                        Login
                    </Typography>
                    <form onSubmit={handleSubmit(onSubmit)}>
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
                            Login
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </Container>
    );
};

export default LoginPage;
