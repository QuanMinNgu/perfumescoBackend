const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
class userController{
    async register(req,res){
        try{
            const {email,password,address,name} = req.body;
            const user = await User.findOne({email});
            if(user){
                return res.status(400).json({msg:"Tài khoản đã tồn tại."});
            }
            const hashed = await bcrypt.hash(password,12);
            const newUser = new User({
                name,
                email,
                address,
                password:hashed
            });
            await newUser.save();
            res.status(200).json({msg:"Đăng kí thành công."});
        }
        catch(err){
            return res.status(500).json({msg:err.message});
        }
    }

    async login(req,res){
        try{
            const {email,password} = req.body;
            const user = await User.findOne({email});
            if(!user){
                return res.status(400).json({msg:"Tài khoản không hề tồn tại."});
            }
            const validPassword = await bcrypt.compare(password,user.password);
            if(!validPassword){
                return res.status(400).json({msg:"Mật khẩu sai."});
            }
            const accessToken = createAccessToken(user);
            res.status(200).json({accessToken,msg:"Đăng nhập thành công.",name:user.name,image:user.image,rule:user.rule,id:user._id});
        }
        catch(err){
            return res.status(500).json({msg:err.message});
        }
    }

    async changePassword(req,res){
        try{
            const {password} = req.body;
            const user = await User.findById(req.user.id);
            if(!user){
                return res.status(400).json({msg:"Bạn nên đăng nhập lại nếu có tài khoản."});
            }
            const hashed = await bcrypt.hash(password,12);
            await User.findByIdAndUpdate(user._id,{
                password:hashed
            });
            res.status(200).json({msg:"Đổi mật khẩu thành công."}); 
        }
        catch(err){
            return res.status(500).json({msg:err.message});
        }
    }

    async getPassword(req,res){
        try{
            const {email} = req.body;
            const user = await User.findOne({email});
            if(!user){
                return res.status(400).json({msg:"Tài khoản không hề tồn tại."});
            }
            const password = 12345678;
            const hashed = await bcrypt.hash(password,12);
            await User.findOneAndUpdate({email},{
                password:hashed
            });
            res.status(200).json({msg:"Đổi mật khẩu thành công."});
        }
        catch(err){
            return res.status(500).json({msg:err.message});
        }
    }

    async deleteUser(req,res){
        try{
            const user = await User.findById(req.params.id);
            if(!user){
                return res.status(400).json({msg:"Tài khoản không hề tồn tại."});
            }
            await User.findByIdAndDelete(user._id);
            res.status(200).json({msg:`Xóa ${user.name} thành công.`});
        }
        catch(err){
            return res.status(500).json({msg:err.message});
        }
    }

    async getUsers(req,res){
        try{
            const api = new apiRequest(User.find().select('-password'),req.query).sorting().paginating().filtering().searching();
            const user = await api.query;
            const count = await User.count(api.query.limit(null).skip(null));
            return res.status(200).json({count,user});
        }
        catch(err){
            return res.status(500).json({msg:err.message});
        }
    }


    async getOne(req,res){
        try{
            const user = await User.findById(req.user.id).populate('cart.user_cart');
            if(!user){
                return res.status(400).json({msg:"Tài khoản không hề tồn tại."});
            }
            return res.status(200).json({user});
        }
        catch(err){
            return res.status(500).json({msg:err.message});
        }
    }
    
    async adminGetOne(req,res){
        try{
            const user = await User.findById(req.params.id).select('-password').populate('cart.user_cart');
            const newUser = await User.findById(req.user.id);
            if(!user){
                return res.status(400).json({msg:"Tài khoản không tồn tại."});
            }
            if(newUser._id.toString() !== user._id.toString() && newUser.rule !== 'admin'){
                return res.status(400).json({msg:"Bạn không thể làm việc này."});
            }
            res.status(200).json({user});
        }
        catch(err){
            return res.status(500).json({msg:err.message});
        }
    }

    async logout(req,res){
        try{
            res.clearCookie("refreshToken");
            res.status(200).json({msg:"Đăng xuất thành công."});
        }
        catch(err){
            return res.status(500).json({msg:err.message});
        }
    }

    async addCart(req,res){
        try{
            const {cart} = req.body;
            const user = await User.findById(req.user.id);

            const check = user.cart.every(item => item.user_cart.toString() !== cart.user_cart.toString());
            if(!check){
                return res.status(400).json({msg:"Bạn đã có sản phẩm này trong rỏ hàng."});
            }
            user.cart.unshift(cart);
            await User.findByIdAndUpdate(req.user.id,{
                cart:user.cart
            });
            res.status(200).json({msg:"Thêm thành công sản phẩm vào rỏ hàng của bạn."});
        }
        catch(err){
            return res.status(500).json({msg:err.message});
        }
    }

    async updateUser(req,res){
        try{
            const {name,image,address} = req.body;
            const user = await User.findById(req.user.id);
            if(!user){
                return res.status(400).json({msg:"Tài khoản này không hề tồn tại."});
            }
            await User.findByIdAndUpdate(req.user.id,{
                image,name,address
            });
            res.status(200).json({msg:"Cật Nhật Thành Công."});
        }
        catch(err){
            return res.status(500).json({msg:err.message});
        }
    }

    async replaceCart(req,res){
        try{
            const user = await User.findById(req.user.id);
            if(!user){
                return res.status(400).json({msg:"Tài khoản này không hề tồn tại."});
            }
            user.cart = user.cart.filter(item => item.user_cart.toString() !== req.params.id.toString());
            await User.findByIdAndUpdate(req.user.id,{
                cart:user.cart
            });
            res.status(200).json({msg:"Xóa khỏi rỏ hàng thành công."});
        }
        catch(err){
            return res.status(500).json({msg:err.message});
        }
    }

    async addCount(req,res){
        try{
            const {count} = req.body;
            const user = await User.findById(req.user.id);
            if(!user){
                return res.status(400).json({msg:"Tài khoản này không hề tồn tại."});
            }
            user.cart = user.cart.map(item => {
                if(item.user_cart._id.toString() === req.params.id.toString()){
                    item.count = count;
                }
                return item;
            })
            await User.findByIdAndUpdate(req.user.id,{
                cart:user.cart
            });
            res.status(200).json({msg:"Thành Công."});
        }
        catch(err){
            return res.status(500).json({msg:err.message});
        }
    }
}
function createAccessToken(user){
    return jwt.sign({id:user._id},process.env.ACCESSTOKEN,{expiresIn:"3d"});
}
module.exports = new userController;