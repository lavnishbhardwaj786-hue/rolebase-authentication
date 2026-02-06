const express=require("express");
const router=express.Router();
const authmiddleware=require("../middleware/auth-middleware.js");
const adminmiddleware=require("../middleware/admin-middleware.js");
const uploadMiddleware = require("../middleware/upload-middleware.js");
const {uploadimage,fetchallimage, deleteimagecontroller}=require("../controller/image-controller.js");
// if we have to store image locally we use multer for cloude storage we use claudinary

router.post('/upload',authmiddleware,adminmiddleware,uploadMiddleware.single('image'),uploadimage);

router.get('/get',authmiddleware,adminmiddleware,fetchallimage);
router.delete('/:id',authmiddleware,adminmiddleware,deleteimagecontroller);
module.exports=router