const claudinary=require("../config/claudinary.js");

const uploadtoclaudinary=async (filepath)=>{
    try{
        const result =await claudinary.uploader
        .upload(filepath)

        return{
            url:result.secure_url,
            publicid:result.public_id,
        }
        
    }catch(e){
        console.error("claudinary error",e);
        throw e;
    }
}


module.exports={
    uploadtoclaudinary
}