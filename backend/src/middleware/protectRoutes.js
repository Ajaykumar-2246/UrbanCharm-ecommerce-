import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import { User } from "../models/userModel.js";

// Protect routes by checking JWT token
export const protect = asyncHandler(async (req, res, next) => {
  const token = req.cookies.jwt; // Get token from cookies

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Decode JWT
      req.user = await User.findById(decoded.userId).select("-password"); // Find the user and exclude password
      next(); // Proceed to the next middleware or route handler
    } catch (err) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});


export const AdminProtect=asyncHandler(async(req,res,next)=>{
    const user=req.user;
    if(user && user.isAdmin){
        next();
    }else{
        res.status(401);
        throw new Error('Not authorized as admin');
    }
})