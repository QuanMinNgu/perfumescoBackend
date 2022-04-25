const Brand = require('../models/brandModel');

class brandController{
    async getBrand(req,res){
        try{
            const brands = await Brand.find();
            return res.status(200).json({brands});
        }
        catch(err){
            return res.status(500).json({msg:err.message});
        }
    }

    async createBrand(req,res){
        try{
            const {name,reply} = req.body;
            const brand = new Brand({name,reply});
            await brand.save();
            return res.status(200).json({msg:`Tạo thành công ${name}.`});
        }
        catch(err){
            return res.status(500).json({msg:err.message});
        }
    }

    async updateBrand(req,res){
        try{
            const {reply} = req.body;
            const brand = await Brand.findOne({slug:req.params.slug});
            if(!brand){
                return res.status(400).json({msg:`Không có brand này.`});
            }
            await Brand.findOneAndUpdate({slug:req.params.slug},{reply});
            return res.status(200).json({msg:`Update ${brand.name} thành công.`});
        }
        catch(err){
            return res.status(500).json({msg:err.message});
        }
    }

    async deleteBrand(req,res){
        try{
            const brand = await Brand.findOne({slug:req.params.slug});
            if(!brand){
                return res.status(400).json({msg:`Không có brand này.`});
            }
            await Brand.findOneAndDelete({slug:req.params.slug});
            return res.status(200).json({msg:`Xóa ${brand.name} thành công.`});
        }
        catch(err){
            return res.status(500).json({msg:err.message});
        }
    }

    async getBrandReply(req,res){
        try{
            const brand = await Brand.find();
            const brands = brand.filter(item => {
                return item.reply.includes(req.params.categary) === true;
            })
            return res.status(200).json({brands});
        }
        catch(err){
            return res.status(500).json({msg:err.message});
        }
    }
}

module.exports = new brandController;