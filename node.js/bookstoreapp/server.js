require('dotenv').config();// this read the env file and give in key value pair and which are used by the proces object 
const express =require("express");
const app=express();
const bookroutes=require("./routes/book-routes.js");

// we have to connect to the database in db file 
const connecttoDB=require('./database/db.js');
connecttoDB.connecttodb();

app.use(express.json());//When a request is made, Express checks the mounted routes; if the path matches, the request is forwarded to the imported router file, and the specific handler whose method and path match is executed.

app.use("/api/books",bookroutes);

const port=process.env.port||3000// here it will read the port in env and give it to the port in server.js
app.listen(port,()=>{
    console.log(`server is listening to the ${port} `);
}); 