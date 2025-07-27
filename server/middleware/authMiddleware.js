import User from "../models/User";



export const protect = async(req, res, next)=>{
    const{userID} = req.auth;
    if(!userID){
        res.json({success: false, message: "not authorised"})
    }
    else{
        const user= await User.findById(userID);
        req.user = user;
        next()
    }
}