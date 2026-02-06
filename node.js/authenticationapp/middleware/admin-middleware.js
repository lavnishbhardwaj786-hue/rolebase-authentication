

const adminmiddleware=(req,res,next)=>{

    if(req.userInfo.role!=="admin"){

        return res.status(404).json({
            success:false,
            message:"access denied you are not an admin"
        });
    }
    next();
}
module.exports=adminmiddleware