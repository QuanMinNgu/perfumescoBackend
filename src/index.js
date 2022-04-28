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
const Product = require('./models/productModel');

const url = "https://perfumesco.netlify.app";
//const url = "http://localhost:3000";

app.use(express.json());
app.use(cors({credentials: true, origin: url}));
app.use(cookieParser());

const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
      origin: url,
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

    socket.on('increwatch',async slug => {
        const product = await Product.findOne({slug:slug.slug});
        await Product.findOneAndUpdate({slug:slug.slug},{
            watch:product.watch + 1
        });
    })

    socket.on('likeComment',async infor => {
        const comment = await Comment.findById(infor.comment_id);
        const check = comment.like.every(item => item.toString() !== infor.id);
        if(check && infor.id){
            comment.like.push({_id:infor.id});
            await Comment.findByIdAndUpdate(infor.comment_id,{
                like:comment.like
            });
        }
    })

    socket.on("unlikeComment",async infor => {
        const comment = await Comment.findById(infor.comment_id);
        comment.like = comment.like.filter(item => item.toString() !== infor.id);
        await Comment.findByIdAndUpdate(infor.comment_id,{
            like:comment.like
        });
    })

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
