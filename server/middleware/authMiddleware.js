import { verifyToken } from '@clerk/backend';
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: "not authorised - no token provided" 
      });
    }
    
    const token = authHeader.split(' ')[1];
    
    try {
      // Verify the Clerk token with correct parameters
      const verifiedToken = await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY, // Fixed parameter name
        // Remove authorizedParties - this is handled by domain config in Clerk dashboard
      });
      
      const userID = verifiedToken.sub; // Clerk user ID
      
      if (!userID) {
        return res.status(401).json({ 
          success: false, 
          message: "not authorised - invalid token" 
        });
      }
      
      // Find user by clerkId
      let user = await User.findOne({ clerkId: userID });
      
      if (!user) {
        // Create user if doesn't exist
        user = new User({
          clerkId: userID,
          email: verifiedToken.email || '', // Get email from token
          username: verifiedToken.username || '', // Get username from token
          image: verifiedToken.image_url || '', // Get image from token
          role: "user", // default role
          recentSearchedCities: []
        });
        
        try {
          await user.save();
          console.log("New user created:", userID);
        } catch (saveError) {
          console.error("Error creating user:", saveError);
          return res.status(500).json({ 
            success: false, 
            message: "error creating user" 
          });
        }
      }
      
      req.user = user;
      req.auth = { userId: userID };
      next();
      
    } catch (verifyError) {
      console.error("Token verification error:", verifyError);
      return res.status(401).json({ 
        success: false, 
        message: "not authorised - invalid token" 
      });
    }
    
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "server error" 
    });
  }
};
