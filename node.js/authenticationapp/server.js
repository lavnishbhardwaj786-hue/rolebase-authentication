require('dotenv').config();
const express=require('express');
const cors = require("cors");
const app=express();
app.use(cors());
app.use(express.json());


const dbconnection=require("./database/dj.js");
dbconnection.connection();

const uploadimageroutes=require("./routes/image-routes.js");
app.use("/api/image",uploadimageroutes);


const authroutes=require("./routes/auth-routes.js");
app.use('/api/auth',authroutes);


const homeroutes=require("./routes/home-routes.js");
app.use("/api/home",homeroutes);


const adminroutes=require("./routes/admin-route.js");
app.use("/api/admin",adminroutes);


app.get('/',(req,res)=>{
    res.status(200).json({
        message:"server is running"
    });
});

const port=process.env.port||5000;
app.listen(port,()=>{
    console.log(`server is listening to the ${port} `);
});