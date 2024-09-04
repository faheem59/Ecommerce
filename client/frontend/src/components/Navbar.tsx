import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { logout } from '../redux/authSlice';

const Navbar: React.FC = () => {
    const dispatch = useDispatch()
    const user = useSelector((state: RootState) => state.auth.user);

    const logoutUser = () => {
        dispatch(logout())
    }
    return (
        <AppBar position="static" sx={{ backgroundColor: "black" }}>
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Product Management
                </Typography>
                <Button color="inherit" component={Link} to="/" >
                    Home
                </Button>
                {!user ? (
                    <>
                        <Button color="inherit" component={Link} to="/login">
                            Login
                        </Button>
                        <Button color="inherit" component={Link} to="/register">
                            Register
                        </Button>
                    </>
                ) : user.isAdmin ? (
                    <>
                        <Button color="inherit" component={Link} to="/add-product">
                            Add Product
                        </Button>
                        <Button color="inherit" component={Link} to="/cart">
                            Cart
                        </Button>
                        <Button color="inherit" onClick={logoutUser}>
                            Logout
                        </Button>
                    </>
                ) : (
                    <>
                        <Button color="inherit" component={Link} to="/cart">
                            Cart
                        </Button>
                        <Button color="inherit" onClick={logoutUser}>
                            Logout
                        </Button>
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
