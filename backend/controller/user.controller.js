import {User} from "../models/user.model.js"
import { v2 as cloudinary } from 'cloudinary';
import bcrypt from 'bcryptjs';
import createTokenAndSaveCookies from "../jwt/AuthToken.js"




export const register = async (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: "user photo is required" });
    }

    const { photo } = req.files;
    const allowedFormat = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedFormat.includes(photo.mimetype)) {
      return res.status(400).json({ message: "only jpg and png are allowed" });
    }

    const { email, name, password, phone, education, role } = req.body;

    if (!email || !name || !password || !phone || !education || !role || !photo) {
      return res.status(400).json({ message: "saari information ko bharo" });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "email already exist" });
    }

    const cloudinaryResponse = await cloudinary.uploader.upload(photo.tempFilePath);

    if (!cloudinaryResponse || cloudinaryResponse.error) {
      console.log(cloudinaryResponse.error);
      return res.status(500).json({ message: "Photo upload failed" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      name,
      password: hashedPassword,
      phone,
      education,
      role,
      photo: {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.url,
      },
    });

    await newUser.save();

    const token = await createTokenAndSaveCookies(newUser._id, res);

    return res.status(200).json({
      message: "user register successfully",
      newUser,
      token: token,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ message: "Internal server error kuch toh garbad hai daya", error: error.message });
  }
};


    






    export const login = async (req, res) => {
        const { email, password, role } = req.body;

        try {
            if (!email || !password || !role) {
                return res.status(400).json({ message: "Please fill required details" });
            }

            const user = await User.findOne({ email }).select('+password'); // Include the password field

            if (!user) {
                return res.status(400).json({ message: "User not registered" });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Password does not match" });
            }

            if (user.role !== role) {
                return res.status(400).json({ message: `Given role '${role}' not found` });
            }

            const token = await createTokenAndSaveCookies(user._id, res);

            res.status(200).json({
                message: "User logged in successfully",
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                },
                token: token
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    };  
    






    



    export const logout = async (req, res) =>
    {
        try {
            res.clearCookie('jwt');
             res.status(200).json({ message: "Logged out successfully" });
            } catch (error) {
                console.error(error);
                return res.status(500).json({ message: "Internal server error" });
                }
    }









    export const getMyProfile = async(req,res)=>
    {
      const user = await req.user;


      if(!user)
      {
        return res.status(401).json({message: "Unauthorized"});
      }


      res.status(200).json(user)
    }




  

    export const getAdmins  = async(req,res)=>
    {
      const admins = await User.find({role:"admin"});

      res.status(200).json(admins);
    }