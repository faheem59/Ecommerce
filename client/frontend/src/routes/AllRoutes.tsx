import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoutes from "./PrivateRoutes";
import PublicRoutes from "./PublicRoutes";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

const AllRoutes = () => {
    const user = useSelector((state: RootState) => state.auth.user);

    return (
        <Router>
            <Routes>
                {user ? (
                    <Route path="/*" element={<PrivateRoutes />} />
                ) : (

                    <Route path="/*" element={<PublicRoutes />} />
                )}
            </Routes>
        </Router>
    );
};

export default AllRoutes;
