import { createContext, useContext, useState, useEffect } from "react";
import { getUser } from "../api/api";

const AuthContext = createContext({});

export function AuthContextProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    //// On App Load Check If The User Exists
    useEffect(() => {
        async function fetchUser() {
            try {
                const response = await getUser();
                setUser(response.user);
                setIsAuthenticated(true);
            } catch (error) {
                setUser(null);
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        }
        fetchUser();
    }, []);
    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                isAuthenticated,
                setIsAuthenticated,
                loading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

//// Custom Hook

export function useAuth() {
    return useContext(AuthContext);
}
