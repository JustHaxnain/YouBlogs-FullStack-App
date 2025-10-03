import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadBlog } from "../api/api";

export default function UploadBlog() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [thumbnail, setThumbnail] = useState("");
    const [error, setError] = useState({});
    const [formLoading, setFormLoading] = useState(false);
    const navigate = useNavigate();
    function isValidUrl(str) {
        try {
            new URL(str);
            return true;
        } catch (error) {
            return false;
        }
    }
    function validateForm() {
        const newError = {};
        if (!title.trim()) {
            newError.title = "Title is required.";
        }
        if (title.length > 100) {
            newError.title = "Max 100 characters.";
        }
        if (content.length < 20) {
            newError.content = "Minimum 20 characters.";
        }
        if (thumbnail && !isValidUrl(thumbnail)) {
            newError.thumbnail = "Enter a valid URL.";
        }
        if (!thumbnail) {
            newError.thumbnail = "Enter a valid URL";
        }
        setError(newError);
        return Object.keys(newError).length === 0;
    }
    async function handleSubmit(e) {
        e.preventDefault();
        if (!validateForm()) return;
        setFormLoading(true);
        try {
            const response = await uploadBlog(title, content, thumbnail);
            navigate("/you", { replace: true });
        } catch (error) {
            console.log(error);
        } finally {
            setFormLoading(false);
        }
    }
    return (
        <section className="UploadBlogSection">
            <h1 className="uploadBlogHeading">publish a new Blog :</h1>
            <form onSubmit={handleSubmit} className="uploadBlogForm" noValidate>
                <label htmlFor="title">
                    Title :
                    <input
                        type="text"
                        id="title"
                        maxLength={100}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className={error.title ? "input-error" : ""}
                        placeholder="Enter Blog Title...."
                        required
                    />
                    {error.title ? (
                        <p className="field-error">{error.title}</p>
                    ) : null}
                </label>
                <label htmlFor="content">
                    Content :
                    <textarea
                        name="content"
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Write Your Blog Content....."
                        className={error.content ? "input-error" : ""}
                        rows={8}
                        required
                    />
                    {error.content ? (
                        <p className="field-error">{error.content}</p>
                    ) : null}
                </label>
                <label htmlFor="thumbnail">
                    Thumbnail URL {`( At least 1920 x 1080 pixels )`} :
                    <input
                        type="url"
                        id="thumbnail"
                        value={thumbnail}
                        onChange={(e) => setThumbnail(e.target.value)}
                        className={error.thumbnail ? "input-error" : ""}
                        placeholder="https://example.com/image.jpg"
                        required
                    />
                    {error.thumbnail ? (
                        <p className="field-error">{error.thumbnail}</p>
                    ) : null}
                </label>
                <button
                    type="submit"
                    disabled={formLoading}
                    className="publishBtn"
                >
                    <i className="fa fa-upload" aria-hidden="true" />
                    {formLoading ? "Publishing..." : "Publish Blog"}
                </button>
            </form>
        </section>
    );
}
