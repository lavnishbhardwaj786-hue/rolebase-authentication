const jwt=require("jsonwebtoken");
const authorizationmiddleware=(req,res,next)=>{
try{ 
    const header=req.headers.authorization;
    console.log(req.headers);
    if(!header){
        return res.status(402).json({
            message:"the token is not egenerated"
        })
    }
    const token=header.split(" ")[1];   
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
}
catch(e){
    console.log(e);
}
}

module.exports=authorizationmiddleware;
