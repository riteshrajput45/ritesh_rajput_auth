const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET || 'Ritesh@123'

exports.authMiddleware =(req,res,next)=>{
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(401).json({message:"No token provided"})

    }
    const token = authHeader.split(' ')[1]
    try{

        const decode =jwt.verify(token,JWT_SECRET);
        req.user=decode;
        next()
    }
    catch(err){
        res.status(403).json({message:"Invalid or expired token"})
    }
}