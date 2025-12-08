import jwt from "jsonwebtoken"
import User from "../models/user.model.js"

const authorize = async (req , res , next ) => {

    try{
        let token ;

        const authHeader = req.headers.authorization;
    
        if(authHeader && authHeader.startsWith("Bearer")){
            token = authHeader.split(" ")[1];

            if(!token){
                return res.status(401).json({message : "not authourized ,no token"});
            }
    
            const decoded = jwt.verify(token , process.env.JWT_SECRET);
            
    
            const user = await User.findById(decoded.userId).select("-password");

            if(!user){
                return res.status(401).json({message: "unauthorized , no user found"});
            }
    
            req.user = user;
            next()
            
        }else{
            return res.status(401).json({message : "not authourized ,not token"});
        }
    }catch(error){
        console.log("auth error:",error.message);
        res.status(401).json({message:'unauthorized',})
    }

}

export default authorize;