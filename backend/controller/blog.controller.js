import mongoose from 'mongoose';
import { Blog } from '../models/blog.model.js';
import { v2 as cloudinary } from 'cloudinary';
   
  

export const createBlog = async (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: "Blog image is required." });
    }

    const { blogImage } = req.files;
    const allowedFormat = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedFormat.includes(blogImage.mimetype)) {
      return res.status(400).json({ message: "Only JPG, PNG, and WEBP formats are allowed." });
    }

    const { title, category, about } = req.body;

    if (!title || !category || !about) {
      return res.status(400).json({ message: "Please fill in all blog details." });
    }

 const cloudinaryResponse = await cloudinary.uploader.upload(blogImage.tempFilePath);

    if (!cloudinaryResponse || cloudinaryResponse.error) {
      console.error(cloudinaryResponse.error);
      return res.status(500).json({ message: "Failed to upload blog image." });
    }

    const adminName = req?.user?.name;
    const adminPhoto = req?.user?.photo;
    const createdBy = req?.user?._id;

    const blogData = {
      title,
      about,
      category,
      adminName,
      adminPhoto,
      createdBy,
      blogImage: {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
      },
    };

    const blog = await Blog.create(blogData);

    return res.status(201).json({
      message: "Blog created successfully.",
      blog,
    });

  } catch (error) {
    console.error("Blog creation error:", error);
    return res.status(500).json({ message: "An error occurred while creating the blog." });
  }
};




export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    await blog.deleteOne();

    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};





export const getAllBlogs = async(req,res) =>
{
    const allBlogs = await Blog.find();
    res.status(200).json(allBlogs);
}




export const getSingleBlog = async (req,res)=>
{
  const {id} = req.params;


  if(!mongoose.Types.ObjectId.isValid(id))
  {
    return res.status(400).json({message:"invalid  blog id"})
  }



  const blog = await Blog.findById(id);
  
  if(!blog)
  {
    return res.status(404).json({message:"blog not found"});
  }


  res.status(200).json(blog);
}



export const getMyBlogs = async (req, res) => {
  try {
    const createdBy = req.user._id;
    // console.log("User ID (createdBy):", createdBy);
    const myBlogs = await Blog.find({ createdBy });
    res.status(200).json(myBlogs);
  } catch (error) {
    console.error("Error fetching user blogs:", error);
    res.status(500).json({ message: "Failed to fetch blogs" });
  }
};





export const updateBlog = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid Blog id" });
  }
  const updatedBlog = await Blog.findByIdAndUpdate(id, req.body, { new: true });
  if (!updatedBlog) {
    return res.status(404).json({ message: "Blog not found" });
  }
  res.status(200).json(updatedBlog);
};







export const toggleLikeBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      return res.status(400).json({ message: "Invalid blog ID" });
    }

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const isLiked = blog.likes.includes(userId);

    if (isLiked) {
      blog.likes.pull(userId);
    } else {
      blog.likes.push(userId);
    }

    await blog.save();

    res.status(200).json({
      message: isLiked ? "Blog unliked" : "Blog liked",
      likesCount: blog.likes.length,
      liked: !isLiked
    });

  } catch (error) {
    console.error("Toggle like error:", error);
    res.status(500).json({ message: "Server error" });
  }
};











