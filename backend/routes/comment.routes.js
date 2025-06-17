import express from "express";
import { addComment, getCommentsForBlog } from "../controller/comment.controller.js";
import { isAuthenticated } from "../middleware/authUser.js";

const router = express.Router();

// Add a new comment
router.post("/:blogId", isAuthenticated, addComment);

// Get all comments for a blog
router.get("/:blogId", getCommentsForBlog);

export default router;
