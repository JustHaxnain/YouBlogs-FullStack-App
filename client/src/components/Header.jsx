import React, { useState } from "react";
import { NavLink, useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContextProvider";
import LazyImage from "./LazyImage";

export default function Header() {
    const { user, isAuthenticated, loading } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const [search, setSearch] = useState(searchParams.get("search") || "");
    const navigate = useNavigate();
    function searchHandler() {
        if (search.trim()) {
            setSearchParams({
                search: search,
                page: 1,
            });
        } else {
            setSearchParams({ page: 1 });
        }
    }
    return (
        <header>
            <nav>
                <div className="logo">
                    <img
                        src="/youBlogss.png"
                        alt="youBlog"
                        title="youBlog"
                        className="youBlogLogo"
                    />
                    <NavLink to="/">YouBlogs</NavLink>
                </div>
                <div className="searchBarContainer">
                    <form
                        className="searchForm searchInputContainer"
                        onSubmit={async (e) => {
                            e.preventDefault();
                            searchHandler();
                        }}
                    >
                        <input
                            type="text"
                            name="search"
                            id="searchInput"
                            className="searchInput"
                            placeholder="Search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button type="submit" className="searchBtn">
                            <i className="fa fa-search" aria-hidden={true}></i>
                        </button>
                    </form>
                </div>
                <div className="navLinks">
                    {!loading ? (
                        isAuthenticated ? (
                            <>
                                <NavLink
                                    to="/you/uploadBlog"
                                    className="createBlogBtnLink"
                                >
                                    <button className="createBlogBtn">
                                        <i className="fa fa-plus"></i>
                                        Create
                                    </button>
                                </NavLink>
                                <NavLink to="/you">
                                    <LazyImage
                                        src={user?.userImage}
                                        alt={"Profile Picture"}
                                        title={"Profile Picture"}
                                        borderRadius={"100%"}
                                        containerHeight={"45px"}
                                        containerWidth={"45px"}
                                        className={"navProfile"}
                                    />
                                </NavLink>
                            </>
                        ) : (
                            <NavLink to="/login" className="logInBtnLink">
                                <button className="navLogInBtn ">Login</button>
                            </NavLink>
                        )
                    ) : null}
                </div>
            </nav>
        </header>
    );
}
