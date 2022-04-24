const Categary = require('../models/categaryModel');
class categaryController{
    async getCategary(req,res){
        try{
            const categary = await Categary.find();
            return res.status(200).json({categary});
        }
        catch(err){
            return res.status(500).json({msg:err.message});
        }
    }

    async createCategary(req,res){
        try{    
            const {name} = req.body;
            const categary = new Categary({name});;
            await categary.save();
            return res.status(200).json({msg:`Tạo thành công ${name}`});
        }
        catch(err){
            return res.status(500).json({msg:err.message});
        }
    }

    async deleteCategary(req,res){
        try{
            const categary = await Categary.findOne({slug:req.params.slug});
            if(!categary){
                return res.status(400).json({msg:"Categary này không tồn tại."});
            }
            await Categary.findOneAndDelete({slug:req.params.slug});
            res.status(200).json({msg:`Xóa thành công ${categary.name}.`});
        }
        catch(err){
            return res.status(500).json({msg:err.message});
        }
    }
}

module.exports = new categaryController;