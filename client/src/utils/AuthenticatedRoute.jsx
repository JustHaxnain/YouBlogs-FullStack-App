import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContextProvider";
import Loading from "../components/Loading";

export default function AuthenticatedRoute() {
    const { isAuthenticated, loading } = useAuth();
    if (loading) {
        return <Loading />;
    } else {
        return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
    }
}
