import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { Blog } from "../models/blog.model.js";

// ➕ Create a comment
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const { blogId } = req.params;

    if (!text) {
      return res.status(400).json({ message: "Comment text is required." });
    }

    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      return res.status(400).json({ message: "Invalid blog ID." });
    }

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found." });
    }

    const comment = await Comment.create({
      blog: blogId,
      user: req.user._id,
      userName: req.user.name,
      userPhoto: req.user.photo,
      text,
    });

    res.status(201).json(comment);
  } catch (error) {
    console.error("Add comment error:", error);
    res.status(500).json({ message: "Failed to add comment." });
  }
};

// 📥 Get comments for a specific blog
export const getCommentsForBlog = async (req, res) => {
  try {
    const { blogId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      return res.status(400).json({ message: "Invalid blog ID." });
    }

    const comments = await Comment.find({ blog: blogId })
      .sort({ createdAt: -1 })
      .exec();

    res.status(200).json(comments);
  } catch (error) {
    console.error("Get comments error:", error);
    res.status(500).json({ message: "Failed to fetch comments." });
  }
};
