const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const router = require('./routes/index');
const user = require('./models/userModel');
const Comment = require('./models/comment');
app.use(express.json());
app.use(cors({credentials: true, origin: 'https://perfumesco.netlify.app'}));
app.use(cookieParser());

const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
      origin: "https://perfumesco.netlify.app",
      methods: ["GET", "POST"],
      allowedHeaders: ["my-custom-header"],
      credentials: true
    }
});

let users = [];
io.on("connection",socket => {

    socket.on("joinRoom",id => {
        const user = {socketId:socket.id,room:id.room,name:id.username,id:id.userid};

        const check = users.every(user => user.id !== id.userid);
        if(check){
            users.push(user);
            socket.join(user.room);
        }
        else{
            users.map(item => {
                if(item.id === user.id){
                    if(item.room !== user.room){
                        socket.leave(item.room);
                        socket.join(user.room);
                        item.room = user.room;
                    }
                }
            })
        }
    });

    socket.on('createComment',async infor => {
        const comment = new Comment({product_slug:infor.product_slug,
        user:infor.user,
        content:infor.content
        });
        await comment.save();
        const newComment = await Comment.findById(comment._id).populate("user","name image _id");
        io.to(infor.product_slug).emit("getComment",newComment);
    })

    
    socket.on("disconnect",() =>{
        users = users.filter(user => user.socketId !== socket.id);
    })
})

mongoose.connect(process.env.DATABASE_URL,{useNewUrLParser:true})
    .then(() => console.log("Connected to database"))
    .catch(err => console.log(`Your erorr :${err}`));


const PORT = process.env.PORT || 5000;

router(app);

http.listen(PORT , () => console.log("Connected to port 5000"));
