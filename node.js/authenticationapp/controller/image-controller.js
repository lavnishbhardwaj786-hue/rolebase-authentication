const image=require("../models/image.js");
const {uploadtoclaudinary} =require("../helper/claudinaryhelper.js")
const claudinary=require('../config/claudinary.js');
// const fs=require('fs');

const uploadimage= async (req,res)=>{
try {
    // check if file is missing in request object
    if(!req.file){
        return res.status(400).json({
            success:false,
            message:"file is required",
        });
    }
   // upload the image
    const {url,publicid}=await uploadtoclaudinary(req.file.path);
    // upload the image in the database
    const newlyuploadedimage=new image({
        url,
        publicid,
        uploadedby:req.userInfo.userId

    });
    await newlycreatedimage.save();


    // fs.unlinkSync(req.file.path);// this will not let image to be stored in upload folder 
 
    res.status(201).json({
        success:true,
        message:"image uploaded",
        image:newlyuploadedimage,
    });
} catch (e) {
    console.log(e);
    res.status(500).json({
        success:false,
        message:"something went wrong ",
    });
}
};
const fetchallimage= async (req,res)=>{
try {
    const page=parseInt(req.query.page)||1;
    const limit=parseInt(req.query.limit)||5;
    const skip=(page-1)*limit;
    const sortby=req.query.sortBy||'created at';
    const sortorder=req.query.sortorder==='asc'?1:-1;
    const totalimage=await image.countDocuments();
    const totalpage=Math.ceil(totalimage/limit);
    
    const sortobj={};
    sortobj[sortby]=sortorder;

    const images=image.find().sort(sortobj).skip(skip).limit(limit);
    if(images){
        res.status(200).json({
            success:true,
            currentpage:page,
            totalpage:totalpage,
            totalimage:totalimage,
            images:images,
        });
    }   
} catch (e) {
    console.log(e);
    res.status(500).json({
        success:false,
        message:"something went wrong ",
    });
}
};
const deleteimagecontroller=async ()=>{
    try{
        const getidofimagetobedeleted=req.params.id;
        const Idofuser=req.userInfo.userId;
        const image=await image.findById(getidofimagetobedeleted);
        if(!image){
            return res.status(404).json({
                success:false,
                message:"image not found",
            });
        };
    // check if image is uploaded by the user who is trying to delete the image 
        if(image.uploadedby.toString() !== idofuser){
            return res.status(403).json({
                success:false,
                message:"you are not authrized to delete image making an online fir on you ",
            });
        };
    // now have to delete from claudinary first 
        await claudinary.uploader.destroy(image.publicid);

        await image.findByIdAndDelete(getidofimagetobedeleted);
         res.status(200).json({
                success:true,
                message:"image deleted successfully ",
            });
    }catch(e){
    console.log(e);
    res.status(500).json({
        success:false,
        message:"something went wrong ",
    });
    }
}
module.exports={
    uploadimage,
    fetchallimage,
    deleteimagecontroller,
};