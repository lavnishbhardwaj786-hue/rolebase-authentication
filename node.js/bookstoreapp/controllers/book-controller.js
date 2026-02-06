const book = require('../models/book.js');

const getallbooks = async (req, res) => {
    try {
        const allbooks = await book.find();
        if (allbooks?.length > 0) {// (  ? says is “If allBooks exists (is NOT null or undefined), then access its length.”
            res.status(200).json({
                success: true,
                message: 'List of books fetched successfully',
                data: allbooks
            });
        }// json file works in key value pair so if i pass one number in an object form then it will create it's key and than show the answer with both 
        else {
            res.status(404).json({
                success: false,
                message: 'book not found'
            });
        }
    }
    catch (e) {
        console.log(e);
        res.status(404).json({
            message: 'something went wrong hehehe'
        })
    }
};
const getsinglebookbyId = async (req, res) => {
    try {
        const userid=req.params.id;
        const datafromuserid=await book.findById(userid);
        if(!datafromuserid){
            return res.status(404).json({
                success:false ,
                message: "yo the api is done with us "
            });
        }
        res.status(200).json({
            message:"successful",
            data:datafromuserid
        });
    }
    catch (e) {
        console.log(e);
        res.status(404).json({
            message: 'something went wrong hehehe'
        })
    }
}
const addnewbook = async (req, res) => {
    try {
        const newbookdata = req.body;
        const newlycreatedbook = await book.create(newbookdata);
        if (newbookdata) {
            res.status(201).json({
                created: true,
                message: "new file created",
                data: newlycreatedbook
            });
        }
    } catch (error) {
        console.log(error, "something wrong ");
    }
}
const updatesinglebook = async (req, res) => {
try{
    const updateformdata=req.body;
    const getbookid=req.params.id;
    const updatebook=await book.findByIdAndUpdate(getbookid,updateformdata,{
        new:true // it will give the update book back 
    });
    if(!updatebook){
        res.status(404).json({
            message:"an error as usual or the id is wrong "
        })
    };
    res.status(200).json({
        message:'the operation is done successfully ',
        updatedbook:updatebook
    });
}
catch(e){
    console.log(e);
        res.status(404).json({
            message: 'something went wrong hehehe'
        })
}
}
const deletebookbyId = async (req, res) => {
try{
    const bookId=req.params.id;
    const deletedbook=await book.findByIdAndDelete(bookId);
    if(!deletedbook){
        res.status(404).json({
            message:"it's invalid id "
        })
    };
    res.status(202).json({
        message:"successful"
    })
}
catch(e){
      console.log(e);
        res.status(404).json({
            message: 'something went wrong hehehe'
        });
}
}
module.exports = {
    getallbooks,
    getsinglebookbyId,
    addnewbook,
    updatesinglebook,
    deletebookbyId
};