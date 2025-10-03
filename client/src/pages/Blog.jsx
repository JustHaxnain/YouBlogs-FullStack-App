import React, { Suspense, useState, useEffect } from "react";
import {
    useLoaderData,
    Await,
    useNavigate,
    useLocation,
    Link,
} from "react-router-dom";
import {
    deleteBlog,
    getBlog,
    getUserReactionByBlog,
    postBlogReaction,
} from "../api/api";
import Loading from "../components/Loading";
import { useAuth } from "../utils/AuthContextProvider";
import { useModal } from "../utils/ModalContext";
import LazyImage from "../components/LazyImage";

export function loader({ params }) {
    return {
        blog: getBlog(params.id),
    };
}

export default function Blog() {
    const { user, isAuthenticated, loading } = useAuth();
    const [isHandlerLoading, setIsHandlerLoading] = useState(false);
    const [currentReactionCount, setCurrentReactionCount] = useState({
        likeCount: 0,
        dislikeCount: 0,
    });
    const [currentUserReaction, setCurrentUserReaction] = useState("");
    const [userReactionLoading, setUserReactionLoading] = useState(false);
    const blogPromise = useLoaderData();
    const navigate = useNavigate();
    const location = useLocation();
    const { showModal } = useModal();
    function confirmDelete(id) {
        showModal({
            message: "Are you sure you want to delete this blog?",
            onConfirm: (hideModal) => {
                hideModal();
                handleDeleteBlog(id);
            },
        });
    }
    async function handleDeleteBlog(id) {
        setIsHandlerLoading(true);
        try {
            const response = await deleteBlog(id);
            navigate("/you", { replace: true });
        } catch (error) {
            console.log(error);
        } finally {
            setIsHandlerLoading(false);
        }
    }
    async function handleUserReaction(blogId, reaction) {
        if (loading) return;
        if (isAuthenticated) {
            setUserReactionLoading(true);
            try {
                const response = await postBlogReaction(blogId, reaction);
                setCurrentReactionCount({
                    likeCount: response.likeCount || 0,
                    dislikeCount: response.dislikeCount || 0,
                });
                setCurrentUserReaction(response.updatedUserReaction || "");
            } catch (error) {
                console.log(error);
                navigate("/login");
            } finally {
                setUserReactionLoading(false);
            }
        } else {
            navigate("/login");
            return;
        }
    }
    useEffect(() => {
        if (!blogPromise.blog) return;
        if (blogPromise.blog) {
            blogPromise.blog.then(({ blog }) => {
                setCurrentReactionCount((prev) => {
                    if (
                        prev.likeCount !== blog.likeCount ||
                        prev.dislikeCount !== blog.dislikeCount
                    ) {
                        return {
                            likeCount: blog.likeCount,
                            dislikeCount: blog.dislikeCount,
                        };
                    }
                    return prev; // No change → no re-render loop
                });
                if (isAuthenticated) {
                    setUserReactionLoading(true);
                    getUserReactionByBlog(blog.id)
                        .then((response) => {
                            setCurrentUserReaction(
                                response?.userReaction?.reaction || ""
                            );
                        })
                        .catch(console.error)
                        .finally(() => setUserReactionLoading(false));
                }
            });
        }
    }, [isAuthenticated, loading, blogPromise.blog]);
    function renderBlog({ blog }) {
        const backLink = location.state?.from
            ? {
                  pathname: location.state.from.pathname,
                  search: location.state.from.search,
              }
            : "/";
        return (
            <div className="blogDetailContainer">
                <Link to={backLink} className="backLink">
                    <i className="fa fa-arrow-left"></i>
                    Back
                </Link>
                <div className="blogDetailImg">
                    <LazyImage
                        src={blog.thumbnail}
                        alt={blog.title}
                        title={`${blog.title.substring(0, 50)}`}
                        borderRadius={"10px"}
                        containerWidth={"100%"}
                        containerHeight={"400px"}
                        wrapperWidth={"100%"}
                    />
                </div>
                <div className="blogDetailInfo">
                    <div className="blogDetailTitle">
                        <h1>{blog.title}</h1>
                        <div className="blogDetailReactions">
                            <button
                                className={`likeBtn reactionBtn ${
                                    currentUserReaction === "like"
                                        ? "activeReaction"
                                        : ""
                                }`}
                                disabled={userReactionLoading}
                                onClick={() =>
                                    handleUserReaction(blog.id, "like")
                                }
                            >
                                <i
                                    className="fa-regular fa-thumbs-up"
                                    aria-hidden="true"
                                ></i>
                                <p className="blogDetailReactionsCount">
                                    {currentReactionCount.likeCount}
                                </p>
                            </button>
                            <button
                                className={`dislikeBtn reactionBtn ${
                                    currentUserReaction === "dislike"
                                        ? "activeReaction"
                                        : ""
                                }`}
                                disabled={userReactionLoading}
                                onClick={() =>
                                    handleUserReaction(blog.id, "dislike")
                                }
                            >
                                <i
                                    className="fa-regular fa-thumbs-down"
                                    aria-hidden="true"
                                />
                                <p className="blogDetailReactionsCount">
                                    {currentReactionCount.dislikeCount}
                                </p>
                            </button>
                        </div>
                    </div>
                    <div className="blogDetailAuthorContainer">
                        <div className="blogDetailAuthor">
                            <LazyImage
                                src={blog.userImage}
                                alt={blog.username}
                                title={blog.username}
                                containerHeight={"50px"}
                                containerWidth={"50px"}
                                borderRadius={"100%"}
                            />
                            <div className="blogDetailDate">
                                <h2>{blog.username}</h2>
                                <h4>
                                    Published On :{" "}
                                    {new Date(
                                        blog?.created_at
                                    ).toLocaleDateString("en-GB", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                    })}
                                    {", At "}
                                    {new Date(
                                        blog?.created_at
                                    ).toLocaleTimeString()}
                                </h4>
                                <h6>
                                    Last Updated On :{" "}
                                    {new Date(
                                        blog?.updated_at
                                    ).toLocaleDateString("en-GB", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                    })}
                                    {", At "}
                                    {new Date(
                                        blog?.updated_at
                                    ).toLocaleTimeString()}
                                </h6>
                            </div>
                        </div>
                        {!loading ? (
                            isAuthenticated ? (
                                blog.author_googleId === user.googleId ? (
                                    <div className="blogDetailAction">
                                        <button
                                            className="editBlogBtn"
                                            disabled={isHandlerLoading}
                                            onClick={() =>
                                                navigate(`/editBlog/${blog.id}`)
                                            }
                                        >
                                            <i
                                                className="fa fa-edit"
                                                aria-hidden="true"
                                            ></i>
                                            Edit
                                        </button>
                                        <button
                                            className="delBlogBtn"
                                            onClick={() =>
                                                confirmDelete(blog.id)
                                            }
                                            disabled={isHandlerLoading}
                                        >
                                            <i
                                                className="fa fa-trash"
                                                aria-hidden="true"
                                            ></i>
                                            {isHandlerLoading
                                                ? "Deleting..."
                                                : "Delete"}
                                        </button>
                                    </div>
                                ) : null
                            ) : null
                        ) : null}
                    </div>
                    <div
                        className="blogDetailContent"
                        style={{ whiteSpace: "pre-wrap" }}
                    >
                        <p style={{ whiteSpace: "pre-wrap" }}>{blog.content}</p>
                    </div>
                </div>
            </div>
        );
    }
    return (
        <section className="blogDetailSection">
            <Suspense fallback={<Loading />}>
                <Await resolve={blogPromise.blog}>{renderBlog}</Await>
            </Suspense>
        </section>
    );
}
