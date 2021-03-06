const mongoose = require('mongoose');
const schema = mongoose.Schema;
var slug = require('mongoose-slug-generator');
mongoose.plugin(slug);

const productSchema = new schema({
    title:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    categary:{
        type:String
    },
    sold:{
        type:Number,
        default:0
    },
    origin:{
        type:String,
    },
    description:{
        type:String,
        required:true
    },
    fragrant:{
        type:String
    },
    born:{
        type:Number
    },
    volume:{
        type:String,
        default:0
    },
    price:{
        type:Number,
        required:true
    },
    percent:{
        type:Number
    },
    reducePrice:{
        type:String,
        default:0
    },
    reduce:{
        type:Boolean,
        default:false
    },
    smallcontent:{
        type:String,
    },
    concentration:{
        type:String
    },
    brand:{
        type:String
    },
    timeuse:{
        type:String
    },
    howtouse:{
        type:String
    },
    hot:{
        type:Boolean,
        default:false
    },
    slug:{
        type:String,
        slug:"title",
        unique:true
    },
    watch:{
        type:Number,
        default:0
    },
    bestsell:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true
})

productSchema.index({title:"text",description:"text"});
const product = mongoose.model("Products",productSchema);
product.createIndexes({title:"text",description:"text"});
module.exports = product;
