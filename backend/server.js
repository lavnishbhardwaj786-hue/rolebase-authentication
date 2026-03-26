require('dotenv').config();
const express=require('express');
const dbconnect = require('./database/dbconnect');
const authroutes=require('./routes/authroutes.js');
const teamroutes=require('./routes/teamroutes.js');
const taskroutes=require("./routes/taskroute.js");
const {socketforrealtimetask}=require('./socket/sockettaskhandler.js');
const cors=require('cors');
const http=require('http');
const {Server}=require('socket.io');
const { socketmiddleware } = require('./middleware/socketmiddleware.js');
const app=express();
const httpServer=http.createServer(app);
const io=new Server(httpServer,{
    cors:{
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}
});


app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use((req, res, next) => {
    req.io = io;
    next();
});
app.use(express.json());
dbconnect();
app.use('/api',authroutes);
app.use('/api',teamroutes);
app.use('/api',taskroutes);
io.use(socketmiddleware); // ✅ global socket auth middleware

io.on("connection", (socket) => {
    const { userId, role, teamId } = socket.data; // everything ready ✅

    console.log(`User ${userId} | Role: ${role} | Team: ${teamId}`);

    socket.join(teamId);

    socketforrealtimetask(socket, io, teamId, userId, role);

    socket.on("disconnect", () => {
        console.log(`User ${userId} disconnected from Team ${teamId}`);
    });
});

app.get('/',(req,res)=>{
res.json({
    key:'hello set up done ',
    enjoy:'enjoy your life'
})
})


// rules which you should remember
// Only Leader Can
// create task
// delete team
// add/remove member
// transfer leadership


// Member Can
// view team tasks
// update their own task status
// Leader Can Also
// update any task status

const port=process.env.PORT || process.env.data || 3000;
httpServer.listen(port,()=>{
    console.log(`server is listerning to ${port}`);
})