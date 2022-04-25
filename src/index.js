const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const router = require('./routes/index');

app.use(express.json());
app.use(cors({credentials: true, origin: 'https://sellceoperfume.netlify.app'}));
app.use(cookieParser());

const http = require('http').createServer(app);
const io = require('socket.io')(http);

io.on("connection",socket => {

    io.on("disconnect",() =>{

    })
})

mongoose.connect(process.env.DATABASE_URL,{useNewUrLParser:true})
    .then(() => console.log("Connected to database"))
    .catch(err => console.log(`Your erorr :${err}`));


const PORT = process.env.PORT || 5000;

router(app);

http.listen(PORT , () => console.log("Connected to port 5000"));
