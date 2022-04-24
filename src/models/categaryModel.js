const mongoose = require('mongoose');
const schema = mongoose.Schema;
var slug = require('mongoose-slug-generator');
mongoose.plugin(slug);

const categarySchema = new schema({
    name:{
        type:String,
        required:true
    },
    slug:{
        type:String,
        slug:"name",
        unique:true
    }
},{
    timestamps:true
});

module.exports = mongoose.model("Categaries",categarySchema);