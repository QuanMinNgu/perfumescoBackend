const mongoose = require('mongoose');
const schema = mongoose.Schema;

const userSchema = new schema({
    name:{
        type:String,
        required:true
    },
    image:{
        type:String,
        default:"https://res.cloudinary.com/dqbrxkux1/image/upload/v1647656350/Avatar/l4tfoct4j4ixe9bhn9cu.jpg"
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    address:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    rule:{
        type:String,
        default:"user"
    },
    cart:{
        type:Array,
        default:[]
    }
},{
    timestamps:true
});

userSchema.index({name:"text",email:"text"});
const user = mongoose.model("Users",userSchema);
user.createIndexes({name:"text",email:"text"});
module.exports = user;
