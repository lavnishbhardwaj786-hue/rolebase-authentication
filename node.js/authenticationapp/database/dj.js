const mongoose=require("mongoose");


const connection = async ()=>{
    try{ 
       await mongoose.connect(process.env.mongoos_connect)
        console.log("yo db is connected ");
    }
    catch(error){
         console.log("you db is not connected ",error);
        process.exit(1);
    }
}
module.exports={
    connection
};