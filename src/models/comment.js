const mongoose = require('mongoose');
const schema = mongoose.Schema;


const commentSchema = new schema({
    product_slug:{
        type:String
    },
    content:{
        type:String
    },
    reply:{
        type:[{type:mongoose.Types.ObjectId,ref:"Comments"}]
    },
    user:{type:mongoose.Types.ObjectId,
        ref:"Users"
    },
    like:{
        type:[{type:mongoose.Types.ObjectId,ref:"Users"}]
    }
},{
    timestamps:true
});

module.exports = mongoose.model("Comments",commentSchema);

