import {
    createBrowserRouter,
    createRoutesFromElements,
    RouterProvider,
    Route,
} from "react-router-dom";

// Context Imports
import { AuthContextProvider } from "../utils/AuthContextProvider";
import { ModalProvider } from "../utils/ModalContext";
// Redirect Gaurd Imports
import AuthenticatedRoute from "../utils/AuthenticatedRoute";
import UnAuthenticatedRoute from "../utils/UnAuthenticatedRoute";
// Page Imports
import Layout from "../components/Layout";
import Home, { loader as HomeLoader } from "../pages/Home";
import Login from "../pages/Login";
import You from "../pages/You";
import UserBlogs from "../components/UserBlogs";
import UploadBlog from "../components/UploadBlog";
import Blog, { loader as BlogLoader } from "../pages/Blog";
import EditBlog from "../pages/EditBlog";
import ErrorPage from "../pages/ErrorPage";

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<Layout />} errorElement={<ErrorPage />}>
            //// * Public Routes
            <Route
                index
                loader={HomeLoader}
                element={<Home />}
                errorElement={<ErrorPage />}
            />
            <Route
                path="blog/:id"
                loader={BlogLoader}
                element={<Blog />}
                errorElement={<ErrorPage />}
            />
            //// * Guest Routes
            <Route
                element={<UnAuthenticatedRoute />}
                errorElement={<ErrorPage />}
            >
                <Route
                    path="login"
                    element={<Login />}
                    errorElement={<ErrorPage />}
                />
            </Route>
            //// * Authenticated Routes
            <Route
                element={<AuthenticatedRoute />}
                errorElement={<ErrorPage />}
            >
                <Route
                    element={<EditBlog />}
                    path="editBlog/:id"
                    errorElement={<ErrorPage />}
                />
                <Route
                    path="you"
                    element={<You />}
                    errorElement={<ErrorPage />}
                >
                    <Route
                        index
                        element={<UserBlogs />}
                        errorElement={<ErrorPage />}
                    />
                    <Route
                        path="uploadBlog"
                        element={<UploadBlog />}
                        errorElement={<ErrorPage />}
                    />
                </Route>
            </Route>
        </Route>
    )
);

export default function App() {
    return (
        <AuthContextProvider>
            <ModalProvider>
                <RouterProvider router={router} />
            </ModalProvider>
        </AuthContextProvider>
    );
}
