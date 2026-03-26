import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/authcontext";

const ProtectedRoute = () => {
    const { user } = useAuth();

    if (!user?.token) {
        return <Navigate to="/login" />;
    }

    return <Outlet />;
};

export default ProtectedRoute;