import express from 'express'
import dotenv from 'dotenv'
const app = express()
import mongoose from 'mongoose';
import userRoute from './routes/user.route.js'
import blogRoute from './routes/blog.route.js'
import fileUpload from 'express-fileupload';
import { v2 as cloudinary } from 'cloudinary';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import commentRoutes from "./routes/comment.routes.js";





dotenv.config();


app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
      origin: 'http://localhost:5173',
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);



app.use(fileUpload(
  {
    useTempFiles: true,
    tempFileDir:"/tmp/"
  }
))



const port  = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;

  

// db connection

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Successfully connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1); // Exit on failure
  }
};

connectDB();






app.use("/api/users" , userRoute);
app.use("/api/blogs" , blogRoute);
app.use("/api/comments", commentRoutes);







//CLOUDINARY SET UP


    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUD_NAME, 
        api_key: process.env.API_KEY, 
        api_secret: process.env.API_SECRET
    });





app.listen(port, () => {
  console.log(`server is running on port ${port}`)
})
