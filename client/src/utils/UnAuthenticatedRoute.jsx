import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContextProvider";
import Loading from "../components/Loading";

export default function UnAuthenticatedRoute() {
    const { isAuthenticated, loading } = useAuth();
    return (
        <>
            {loading ? (
                <Loading />
            ) : !isAuthenticated ? (
                <Outlet />
            ) : (
                <Navigate to="/" replace />
            )}
        </>
    );
}
