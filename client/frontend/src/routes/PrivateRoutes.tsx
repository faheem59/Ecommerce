import { Routes, Route, Navigate } from "react-router-dom";
import StripeProvider from "../components/StripeProvider";
import PaymentForm from "../pages/Product/PaymentForm";
import AddProductForm from "../pages/Product/AddProduct";
import Cart from "../pages/Product/Cart";
import ProductList from "../pages/Product/ProductList";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

const PrivateRoutes = () => {
    const user = useSelector((state: RootState) => state.auth.user);

    if (!user) {
        return <Navigate to="/login" />;
    }

    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/cart" element={<Cart />} />
                <Route path="/add-product" element={<AddProductForm />} />
                <Route path="/" element={<ProductList />} />
                <Route
                    path="/payment/:orderId"
                    element={
                        <StripeProvider>
                            <PaymentForm />
                        </StripeProvider>
                    }
                />
            </Routes>
        </>
    );
};

export default PrivateRoutes;
