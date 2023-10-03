const User = require("../Model/userModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const Seller = require("../Model/sellerModel")
const asyncWrapper =require("../Util/asyncWrapper")
const appError = require("../Util/appError")
const httpStatusText = require("../Util/httpStatusText")

let Register = asyncWrapper(
    async (req,res,next ) => {
    let user = await User.findOne({ email: req.body.email }).exec()
    if (user) {
       const error =  appError.createError("Email already exist", 400, httpStatusText.FAIL)
       return next(error)
    }
    const sault = await bcrypt.genSalt(10)
    let hashPassword = await bcrypt.hash(req.body.password, sault)

    const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword,
        role : req.body.role
    })
    await newUser.save()
    //process.env.JWT_SECRET secret key
    res.status(200).send("Register Successfully")
})
let Login = asyncWrapper( async (req, res,next) => {
    let user = await User.findOne({ email: req.body.email })
    if (!user) {
        const error =  appError.createError("This email does not exist", 400, httpStatusText.FAIL)
        return next(error)    }
    let checkPassword = await bcrypt.compare(req.body.password, user.password)
    if (!checkPassword) {
        const error =  appError.createError("Password does not match", 400, httpStatusText.FAIL)
        return next(error)    }
    const token = jwt.sign({ _id: user._id, role : user.role}, process.env.jwt_secret_key)
    res.header("token",token)
    res.cookie("jwt" , token)
    res.status(200).json({ status: httpStatusText.SUCCESS, user})
})
let Logout =  asyncWrapper((req,res,next)=>{
    res.cookie('jwt' ,'' , )
    res.header('token' , '')
    res.status(200).json({status:httpStatusText.SUCCESS,msg:"Log Out successfully"})

})
let UpgradeToSeller =asyncWrapper( async (req, res,next) => {
    const user = await User.findById({ _id: req.params.id })
    if (!user) {
        const error =  appError.createError("This user does not exist", 400, httpStatusText.FAIL)
        return next(error)    }
    if (user.role === 'seller') {
        const error =  appError.createError("This user is already a seller", 400, httpStatusText.FAIL)
        return next(error)  
      }
    //send data at seller database 
    const newSeller = new Seller({
        _id: user._id,
        name: user.name,
        email: user.email,
        password: user.password,
    })

    await newSeller.save()

    user.role = 'seller'
    await user.save()
    res.status(200).json({status:httpStatusText.SUCCESS,user})

})
let UpgradeToAdmin = asyncWrapper(async(req,res,next)=>{
    const userId = req.params.id
    const user = await User.findById(userId)
    if(user.role ==='seller'){
        await Seller.deleteOne(
            {_id : user._id},
        )
    }
    user.role = 'admin'
    await user.save()
    
    await user.save()
    res.status(200).json(user)
})
let deletedUser = asyncWrapper(async (req,res,next)=>{
        const userId = req.params.id
        const user = await User.findByIdAndDelete(userId)
        if (!user){
            const error =  appError.createError("This user does not exist", 400, httpStatusText.FAIL)
            return next(error)        }
        if (user.role === 'seller'){
            await Seller.deleteOne(
                {_id : userId },
            )
        }
        res.status(200).json("deleted successfully")
})





module.exports = {
    Register,
    Login,
    UpgradeToSeller,
    deletedUser,
    UpgradeToAdmin,
    Logout
}