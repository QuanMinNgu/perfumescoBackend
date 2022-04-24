const mongoose = require('mongoose');
const schema = mongoose.Schema;
var slug = require('mongoose-slug-generator');
mongoose.plugin(slug);

const brandSchema = new schema({
    name:{
        type:String,
        required:true
    },
    slug:{
        type:String,
        slug:"name",
        unique:true
    },
    reply:{
        type:Array,
        default:[]
    }
},{
    timestamps:true
});

module.exports = mongoose.model("Brands",brandSchema);