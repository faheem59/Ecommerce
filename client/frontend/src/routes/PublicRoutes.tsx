import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import RegisterPage from "../pages/RegisterPage"
import LoginPage from "../pages/LoginPage"
import ProductList from "../pages/Product/ProductList"
import Navbar from "../components/Navbar"
import Cart from "../pages/Product/Cart"
import Payment from "../pages/Product/Payment"
import StripeProvider from "../components/StripeProvider"
import PaymentForm from "../pages/Product/PaymentForm"



const PublicRoutes = () => {
    return (
        <>
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/" element={<ProductList />} />
                    <Route path="/cart" element={<Cart />} />
                    {/* <Route path="/payment/:orderId" element={<Payment />} /> */}
                    <Route
                        path="/payment/:orderId"
                        element={
                            <StripeProvider>
                                <PaymentForm />
                            </StripeProvider>
                        }
                    />
                </Routes >
            </Router >

        </>
    )
}

export default PublicRoutes