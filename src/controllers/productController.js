const Product = require("../models/productModel");

class apiRequest{
    constructor(query,queryString){
        this.query = query;
        this.queryString = queryString;
    }

    sorting(){
        const sort = this.queryString.sort || '-createdAt';

        this.query = this.query.sort(sort);
        return this;
    }

    paginating(){
        const limit = this.queryString.limit * 1 || 20;
        const page = this.queryString.page * 1 || 1;
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);
        return this;
    }

    searching(){
        const search = this.queryString.search;
        if(search){
            this.query = this.query.find({
                $text:{
                    $search:search
                }
            });
        }
        else{
            this.query = this.query.find();
        }
        return this;
    }
    filtering(){
        const obj = {...this.queryString};
        const exclues = ['page','limit','sort','search'];

        exclues.forEach(el => delete(obj[el]));

        let objStr = JSON.stringify(obj);
        objStr = objStr.replace(/\b(gte|gt|lt|lte|regex)\b/g,match => "$" + match);

        this.query = this.query.find(JSON.parse(objStr));
        return this;
    }

}
class productController{
    async getProduct(req,res){
        try{   
            const api = new apiRequest(Product.find(),req.query).sorting().paginating().searching().filtering();
            const product = await api.query;
            const count = await Product.count(api.query.limit(null).skip(null));
            res.status(200).json({count,product});
        }
        catch(err){
            return res.status(500).json({msg:err.message});
        }
    }

    async createProduct(req,res){
        try{
            const {title,categary,sold,origin,description,fragrant,born,volume,price,percent,
                reducePrice,reduce,smallcontent,concentration,brand,timeuse,
                howtouse,hot,bestsell,image} = req.body;
            const product = new Product({
                title,categary,sold,origin,description,fragrant,born,volume,price,percent,
                reducePrice,reduce,smallcontent,concentration,brand,timeuse,
                howtouse,hot,bestsell,image
            });
            await product.save();
            return res.status(200).json({msg:`Tạo thành công ${title}.`});
        }
        catch(err){
            return res.status(500).json({msg:err.message});
        }
    }

    async deleteProduct(req,res){
        try{
            const product = await Product.findOne({slug:req.params.slug});
            if(!product){
                return res.status(400).json({msg:"Sản phẩm không hề tồn tại."});
            }
            await Product.findOneAndDelete({slug:req.params.slug});
            return res.status(200).json({msg:`Xóa ${product.title} thành công.`});
        }
        catch(err){
            return res.status(500).json({msg:err.message});
        }
    }

    async updateProduct(req,res){
        try{
            const {title,categary,sold,origin,description,fragrant,born,volume,price,percent,
                reducePrice,reduce,smallcontent,concentration,brand,timeuse,
                howtouse,hot} = req.body;
            const product = await Product.findOne({slug:req.params.slug});
            if(!product){
                return res.status(400).json({msg:"Sản phẩm không hề tồn tại."});
            }
            await Product.findOneAndUpdate({slug:req.params.slug},{
                title,categary,sold,origin,description,fragrant,born,volume,price,percent,
                reducePrice,reduce,smallcontent,concentration,brand,timeuse,
                howtouse,hot
            });
            res.status(200).json({msg:`Update ${product.title} thành công.`});
        }
        catch(err){
            return res.status(500).json({msg:err.message});
        }
    }
}

module.exports = new productController;