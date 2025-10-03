import React from "react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import LazyImage from "./LazyImage";
dayjs.extend(relativeTime);

export default function BlogCard({ blog, from }) {
    const truncateSmart = (text, maxLength) => {
        if (text.length <= maxLength) return text;
        const truncated = text.slice(0, maxLength);
        return truncated.slice(0, truncated.lastIndexOf(" ")) + "...";
    };
    return (
        <Link
            to={`/blog/${blog.id}`}
            key={blog.id}
            state={{ from }}
            className="blogContianerLink"
        >
            <div className="blogContainer">
                <div className="blogContainerTop">
                    <div className="blogImage">
                        <LazyImage
                            src={blog.thumbnail}
                            alt={"blog thumbnail"}
                            title={blog.title}
                            containerWidth={"100%"}
                            containerHeight={"175px"}
                            borderRadius={"8px"}
                            className={"blogThumbnail"}
                        />
                    </div>
                    <div className="blogInfo">
                        <div className="blogTitle">
                            <h3 className="blogTitleHeading">
                                {truncateSmart(blog.title, 55)}
                            </h3>
                        </div>
                        <div className="blogDesc">
                            <p
                                className="blogDescPara"
                                styles={{ whiteSpace: "pre-wrap" }}
                            >
                                {truncateSmart(blog.content, 150)}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="authorInfo">
                    <div className="authorProfile">
                        <LazyImage
                            src={blog.userImage}
                            alt={`${blog.username} profile picture`}
                            title={`${blog.username} profile picture`}
                            borderRadius={"100%"}
                            containerHeight={"35px"}
                            containerWidth={"35px"}
                            className={"blogAuthorProfileImage"}
                        />
                        <p className="blogAuthorUserName">{blog.username}</p>
                    </div>
                    <div className="blogUploadTime">
                        <p className="blogUTP">
                            {dayjs(blog.created_at).fromNow()}
                        </p>
                    </div>
                </div>
            </div>
        </Link>
    );
}
