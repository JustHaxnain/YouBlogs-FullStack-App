//// AUTHENTICATION ROUTES

export async function googleOAuth(AuthCode) {
    const response = await fetch(
        `http://localhost:8080/authentication/google`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ AuthCode }),
            credentials: "include",
        }
    );
    const data = await response.json();
    return data;
}

async function fetchWithRefresh(url, options = {}) {
    try {
        let response = await fetch(url, {
            ...options,
            credentials: "include",
        });
        if (response.status === 401) {
            const data = await response.json();
            //// Check why its calling refreshAccessToken route when there no access token in the first place
            if (
                data.message === "TokenExpired" ||
                data.message === "No Access token" ||
                data.message === "Invalid token"
            ) {
                //// Call refresh enpoint
                const refreshReponse = await fetch(
                    "http://localhost:8080/authentication/refresh",
                    {
                        method: "POST",
                        credentials: "include",
                    }
                );
                if (refreshReponse.ok) {
                    //// Retry Orignial request with new access token
                    response = await fetch(url, {
                        ...options,
                        credentials: "include",
                    });
                } else {
                    throw new Error("Session Expired, Please Log in again.");
                }
            } else {
                throw new Error(
                    data.message || "Unauthorized, Please Log in First."
                );
            }
        }
        ////// Only parse final successful response
        /* if (!response.ok) {
            throw new Error("Failed to fetch user.");
        } */
        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error(error.message || "Request Failed");
    }
}

export async function logout() {
    const response = await fetch(
        "http://localhost:8080/authentication/logout",
        {
            method: "POST",
            credentials: "include",
        }
    );
    const data = await response.json();
    return data;
}

//// USER ROUTES

export async function getUser() {
    const response = await fetchWithRefresh(
        "http://localhost:8080/user/profile",
        {
            method: "GET",
        }
    );
    return response;
}

//// Get All Author Blogs

export async function getAllAuthorBlogs() {
    const response = await fetchWithRefresh(
        "http://localhost:8080/user/getAuthorBlogs",
        {
            method: "GET",
            credentials: "include",
        }
    );
    return response;
}

//// * GET BLOG ROUTES

//// Get Specific Blog

export async function getBlog(id) {
    const response = await fetch(
        `http://localhost:8080/getBlog/specificBlog/${id}`,
        {
            method: "GET",
        }
    );
    const data = await response.json();
    return data;
}

//// Get All Blogs

export async function getAllBlogs(page = 1, limit = 7, search = " ") {
    const url = `http://localhost:8080/getBlog/getAllBlogs?page=${page}&limit=${limit}&search=${search}`;
    const response = await fetch(url, {
        method: "GET",
    });
    const data = await response.json();
    return data;
}

//// GET USER REACTION BY SPECIFIC BLOG

export async function getUserReactionByBlog(blogId) {
    const response = await fetchWithRefresh(
        `http://localhost:8080/getBlogDetails/${blogId}/userReaction`,
        {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        }
    );
    return response;
}

//// * BLOG ACTION ROUTES

//// POST BLOG REACTION

export async function postBlogReaction(blogId, reaction) {
    const response = await fetchWithRefresh(
        `http://localhost:8080/blogAction/${blogId}/reactions`,
        {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ reaction }),
        }
    );
    return response;
}

///// Upload Blog Route

export async function uploadBlog(title, content, thumbnail) {
    const response = await fetchWithRefresh(
        "http://localhost:8080/blogAction/uploadBlog",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ title, content, thumbnail }),
        }
    );
    return response;
}

//// Delete Specific Blog

export async function deleteBlog(blogId) {
    const response = await fetchWithRefresh(
        `http://localhost:8080/blogAction/deleteBlog/${blogId}`,
        {
            method: "DELETE",
            credentials: "include",
        }
    );
    return response;
}

//// Edit Blog

export async function editBlog(editBlogId, updatedBlog) {
    const response = await fetchWithRefresh(
        `http://localhost:8080/blogAction/editBlog/${editBlogId}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(updatedBlog),
        }
    );
    return response;
}
