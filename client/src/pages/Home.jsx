import React, { Suspense, useState } from "react";
import {
    Await,
    useLoaderData,
    useLocation,
    useSearchParams,
} from "react-router-dom";
import { useAuth } from "../utils/AuthContextProvider";
import Loading from "../components/Loading";
import { getAllBlogs } from "../api/api";
import BlogCard from "../components/BlogCard";

export async function loader({ request }) {
    const url = new URL(request.url);
    const searchQuery = url.searchParams.get("search") || "";
    const page = url.searchParams.get("page") || 1;
    const limit = url.searchParams.get("limit") || 7;
    return {
        blogs: getAllBlogs(page, limit, searchQuery),
    };
}

export default function Home() {
    const { user, isAuthenticated, loading } = useAuth();
    const { blogs } = useLoaderData();
    const [searchParams, setSearchParams] = useSearchParams();
    const location = useLocation();
    const searchTerm = searchParams.get("search");
    function updateURL(key, value) {
        searchParams.set(key, value);
        setSearchParams(searchParams);
    }
    function renderAllBlogs({ blogs, currentPage, totalItems, totalPages }) {
        const blogCardElement = blogs.map((blog) => {
            return <BlogCard blog={blog} key={blog.id} from={location} />;
        });
        return (
            <>
                <div className="allBlogsContainer">
                    {blogCardElement.length > 0 ? (
                        blogCardElement
                    ) : (
                        <p className="searchResult">" No Blogs Found "</p>
                    )}
                </div>
                <div className="paginationContainer">
                    <button
                        className="paginationBtn"
                        disabled={currentPage <= 1}
                        onClick={() => updateURL("page", currentPage - 1)}
                    >
                        Prev
                    </button>
                    <span className="paginationInfo">
                        {currentPage} / {totalPages}
                    </span>
                    <button
                        className="paginationBtn"
                        disabled={currentPage >= totalPages}
                        onClick={() => updateURL("page", currentPage + 1)}
                    >
                        Next
                    </button>
                </div>
            </>
        );
    }
    return (
        <section className="homePage">
            <div className="welcomeMsg">
                {!loading && isAuthenticated && user ? (
                    <div className="userWelcome">
                        <h1 className="homePageHeading">
                            Welcome, {user.username}! 👋
                        </h1>
                        <h3 className="homePageSecHeading">
                            Your words matter — share your thoughts with the
                            world.
                        </h3>
                        <p>
                            ✍️ Start writing a new blog, revisit your published
                            posts, or continue where you left off.
                        </p>
                        <p>✨ Let’s create something amazing today!</p>
                    </div>
                ) : (
                    <div className="guestWelcome">
                        <h1 className="homePageHeading">
                            Welcome to YourBlogs! 👋
                        </h1>
                        <h3 className="homePageSecHeading">
                            Discover thoughts, stories, and experiences from
                            real people.
                        </h3>
                        <p>
                            ✍️ Dive into fresh perspectives, find your favorite
                            articles, and follow the voices that inspire you.
                        </p>
                        <p>✨ Ready to explore?</p>
                    </div>
                )}
            </div>
            <div className="allBlogsContainerWrapper">
                {searchTerm ? (
                    <h2 className="featuredBlogsHeading">
                        Showing results for{" "}
                        <span className="searchTerm">" {searchTerm} "</span> :
                    </h2>
                ) : (
                    <h2 className="featuredBlogsHeading">featured blogs :</h2>
                )}
                <Suspense fallback={<Loading />} key={searchParams.toString()}>
                    <Await resolve={blogs}>{renderAllBlogs}</Await>
                </Suspense>
            </div>
        </section>
    );
}
