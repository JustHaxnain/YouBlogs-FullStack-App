import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="siteFooter">
            <div className="footerContainer">
                <div className="footerBrand">
                    <div className="logo">
                        <img
                            src="/youBlogss.png"
                            alt="youBlog"
                            title="youBlog"
                            className="youBlogLogo"
                        />
                        <Link to="/">YouBlogs</Link>
                    </div>
                    <p>Your Go To Blog App</p>
                </div>
                <div className="footRight">
                    <p className="footerCopy">
                        Ⓒ {new Date().getFullYear()} #YouBlogs. All rights
                        reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
