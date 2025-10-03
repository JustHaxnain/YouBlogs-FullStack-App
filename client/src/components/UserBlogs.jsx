import React, { useState, useEffect } from "react";
import { useAuth } from "../utils/AuthContextProvider";
import { getAllAuthorBlogs } from "../api/api";
import Loading from "./Loading";
import BlogCard from "./BlogCard";
import { useLocation } from "react-router-dom";

export default function UserBlogs() {
    const [blogs, setBlogs] = useState();
    const { isAuthenticated, loading } = useAuth();
    const [fetchAuthorLoading, setFetchAuthorLoading] = useState(true);
    const location = useLocation();
    useEffect(() => {
        async function getAuthorBlogs() {
            try {
                setFetchAuthorLoading(true);
                const data = await getAllAuthorBlogs();
                setBlogs(data.response || []);
            } catch (error) {
                console.log(error);
            } finally {
                setFetchAuthorLoading(false);
            }
        }
        if (!loading && isAuthenticated) {
            getAuthorBlogs();
        }
    }, [loading, isAuthenticated]);
    const blogElement = blogs?.map((blog) => {
        return <BlogCard blog={blog} key={blog.id} from={location} />;
    });
    return (
        <section className="userBlogs">
            <h1 className="userBlogsHeading">
                Your Blogs{" "}
                {loading || fetchAuthorLoading ? null : `(${blogs.length})`} :
            </h1>
            {loading || fetchAuthorLoading ? (
                <Loading />
            ) : blogs.length === 0 ? (
                <div className="blogWrapper">
                    <p className="NoBlogP">
                        You haven't uploaded any blogs yet.
                    </p>
                </div>
            ) : (
                <div className="blogWrapper">{blogElement}</div>
            )}
        </section>
    );
}
