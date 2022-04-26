const Comment = require('../models/comment');
const User = require('../models/userModel');

class commentController{
    async getComment(req,res){
        try{
            const sort = req.query.sort || '-createdAt';
            const limit = req.query.limit * 1 || 8;
            const page = req.query.page * 1 || 1;
            const skip = limit * (page - 1);
            const comment = await Comment.find({product_slug:req.params.slug}).sort(sort).limit(limit).skip(skip).populate({
                path:"user",
                select:"image name _id"
            }).populate("reply");
            const count = await Comment.countDocuments();
            res.status(200).json({comment,count});
        }
        catch(err){
            return res.status(500).json({msg:err.message});
        }
    }

    async updateComment(req,res){
        try{
            const {content} = req.body;
            const comment = await Comment.findById(req.params.id);
            if(!comment){
                return res.status(400).json({msg:"Bình luận không hề tồn tại."});
            }
            if(req.user.id.toString() !== comment.user._id.toString()){
                return res.status(400).json({msg:"Đây không phải bình luận của bạn."});
            }
            await Comment.findByIdAndUpdate(req.params.id,{
                content
            });
            res.status(200).json({msg:"Cật nhật bình luận thành công."});
        }
        catch(err){
            return res.status(500).json({msg:err.message});
        }
    }

    async deleteComment(req,res){
        try{
            const user = await User.findById(req.user.id);
            if(!user){
                return res.status(400).json({msg:"Vui lòng đăng nhập."});
            }
            const comment = await Comment.findById(req.params.id);
            if(!comment){
                return res.status(400).json({msg:"Bình luận không hề tồn tại."});
            }
            if(comment.user.toString() === user._id.toString() || user.rule === 'admin'){
                await Comment.findByIdAndDelete(req.params.id);
                return res.status(200).json({msg:"Xóa thành công."});
            }
            return res.status(400).json({msg:"Bạn không thể xóa bình luận này."});
        }
        catch(err){
            return res.status(500).json({msg:err.message});
        }
    }

}

module.exports = new commentController;