import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js"


const createTokenAndSaveCookies = async (userId , res) =>
{
    const token = await jwt.sign({userId},process.env.JWT_SECRET_KEY,{
        expiresIn : "30d",

    })

    res.cookie("jwt",token,{
        httpOnly:false,  //xss
        secure:false,    
        sameSite:"none",  //csrf
        path: "/",
    });
   


    await User.findByIdAndUpdate(userId,{token});
    return token
}



export default createTokenAndSaveCookies;
