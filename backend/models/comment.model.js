import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    blog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userPhoto: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
      minlength: 1,
    },
  },
  { timestamps: true }
);

export const Comment = mongoose.model("Comment", commentSchema);
