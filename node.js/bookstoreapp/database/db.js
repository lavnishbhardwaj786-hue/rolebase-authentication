const mongoose=require("mongoose");
const connecttodb=async ()=>{
try{
await mongoose.connect("mongodb+srv://lavnishbhardwaj786_db_user:lavnishbhardwaj786_db_user2@cluster0.vw4jlgg.mongodb.net/");
console.log("mongodb is connected sucessfully ");
}
catch(error){
console.error('mongo db connection failed ',error);
process.exit(1);// it will terminate the server for all users when 1 is used and ( 0 will give normal exit and server terminates  it give like a successful exit)
}                    
finally{
console.log("mongodb connection attempt finish");
}
}
module.exports={
    connecttodb
};