import {
    getAllBlogs,
    getSearchBlogs,
    getBlog,
    getAllBlogsCount,
    searchBlogsCount,
} from "../db/models/blogModel.js";

//// * Get Specific Blog Handler

export async function handleGetSpecificBlog(req, res) {
    try {
        const blogId = req.params.id;
        const response = await getBlog(blogId);
        if (!response) {
            res.status(404).send({
                message: `Couldn't find any blog with id : ${blogId}`,
            });
        }
        res.status(200).send({
            blog: response,
        });
    } catch (error) {
        res.status(500).send({
            message: error,
        });
    }
}

//// * Get All Blogs Handler

export async function handleGetAllBlogs(req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 7;
        const search = req.query.search || "";
        const offset = (page - 1) * limit;
        let response, total;
        if (search) {
            /// search + pagination
            response = await getSearchBlogs(search, limit, offset);
            total = await searchBlogsCount(search);
        } else {
            response = await getAllBlogs(limit, offset);
            total = await getAllBlogsCount();
        }
        res.status(200).send({
            blogs: response,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalItems: total,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: error,
        });
    }
}
