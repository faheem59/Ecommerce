import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

const Navbar: React.FC = () => {
    const user = useSelector((state: RootState) => state.auth.token);
    return (
        <AppBar position="static" sx={{ backgroundColor: "black" }}>
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Product Management
                </Typography>
                <Button color="inherit" component={Link} to="/">
                    Home
                </Button>
                <Button color="inherit" component={Link} to="/add-product">
                    Add Product
                </Button>
                <Button color="inherit" component={Link} to="/cart">
                    Cart
                </Button>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
