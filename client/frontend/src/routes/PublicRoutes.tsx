import { Routes, Route, Navigate } from "react-router-dom";
import RegisterPage from "../pages/RegisterPage";
import LoginPage from "../pages/LoginPage";
import ProductList from "../pages/Product/ProductList";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

const PublicRoutes = () => {
    const user = useSelector((state: RootState) => state.auth.user);

    if (user) {
        // Redirect to home or dashboard if the user is already authenticated
        return <Navigate to="/" />;
    }

    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/" element={<ProductList />} />
                {/* You can add more public routes here */}
            </Routes>
        </>
    );
};

export default PublicRoutes;
