import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { editBlog, getBlog } from "../api/api";
import { useAuth } from "../utils/AuthContextProvider";
import Loading from "../components/Loading";

export default function EditBlog() {
    const { id } = useParams();
    const { isAuthenticated, loading } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        title: "",
        content: "",
        thumbnail: "",
    });
    const [error, setError] = useState({});
    const [formUpdateLoading, setFormUpdateLoading] = useState(false);
    const [fetchFormLoading, setFetchFormLoading] = useState(true);
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
        if (!form.title.trim()) {
            newError.title = "Title is required.";
        }
        if (form.title.length > 100) {
            newError.title = "Max 100 characters.";
        }
        if (form.content.length < 20) {
            newError.content = "Minimum 20 characters.";
        }
        if (form.thumbnail && !isValidUrl(form.thumbnail)) {
            newError.thumbnail = "Enter a valid URL.";
        }
        if (!form.thumbnail) {
            newError.thumbnail = "Enter a valid URL";
        }
        setError(newError);
        return Object.keys(newError).length === 0;
    }
    useEffect(() => {
        setFetchFormLoading(true);
        async function fetchBlog() {
            try {
                const data = await getBlog(id);
                setForm({
                    title: data.blog.title,
                    content: data.blog.content,
                    thumbnail: data.blog.thumbnail,
                });
            } catch (error) {
                console.log(error);
            } finally {
                setFetchFormLoading(false);
            }
        }
        if (!loading && isAuthenticated) {
            fetchBlog();
        }
    }, [id, loading, isAuthenticated]);
    async function handleUpdateBlog(e) {
        e.preventDefault();
        if (!validateForm()) return;
        setFormUpdateLoading(true);
        try {
            const response = await editBlog(id, form);
            navigate(`/blog/${id}`);
        } catch (error) {
            console.log(error);
        } finally {
            setFormUpdateLoading(false);
        }
    }
    return (
        <section className="UploadBlogSection">
            <h1 className="uploadBlogHeading">Update & Publish The Blog :</h1>
            {loading || fetchFormLoading ? (
                <Loading />
            ) : (
                <form
                    onSubmit={handleUpdateBlog}
                    className="uploadBlogForm"
                    noValidate
                >
                    <label htmlFor="title">
                        Title :
                        <input
                            type="text"
                            id="title"
                            maxLength={100}
                            value={form.title}
                            onChange={(e) =>
                                setForm({ ...form, title: e.target.value })
                            }
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
                            value={form.content}
                            onChange={(e) =>
                                setForm({ ...form, content: e.target.value })
                            }
                            placeholder="Write Your Blog Content....."
                            className={error.content ? "input-error" : ""}
                            rows={8}
                            required
                            style={{ height: "300px" }}
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
                            value={form.thumbnail}
                            onChange={(e) =>
                                setForm({ ...form, thumbnail: e.target.value })
                            }
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
                        disabled={formUpdateLoading}
                        className="publishBtn"
                    >
                        <i className="fa fa-upload" aria-hidden="true" />
                        {formUpdateLoading
                            ? "Updating... & Publishing..."
                            : "Update & Publish Blog"}
                    </button>
                </form>
            )}
        </section>
    );
}
