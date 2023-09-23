const User = require("../Model/userModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const Seller = require("../Model/sellerModel")

let Register = async (req,res,nxt ) => {
    try {
        let user = await User.findOne({ email: req.body.email }).exec()
        if (user) {
            console.log(user)
            return res.status(404).json({ data: "this email is already Exit" })
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

    } catch (err) {
        console.error(err)
        res.status(500).send(err.message)
    }
}

let Login = async (req, res) => {
    try {
        let user = await User.findOne({ email: req.body.email })
        if (!user) {
            return res.status("404").send("this invalid email")
        }
        let checkPassword = await bcrypt.compare(req.body.password, user.password)
        if (!checkPassword) {
            return res.status("404").send("this invalid password")
        }
        const token = jwt.sign({ _id: user._id, role : user.role}, "your-secret-key")
        res.header("token",token)
        res.cookie("jwt" , token)
        res.status(200).json({
            msg: "Login Successfully",
            user
        })
    } catch (error) {
        console.error(error)
        res.status(500).send("Internal error")
    }
}
let Logout =  (req,res)=>{
    try {
        res.cookie('jwt' ,'' , )
        res.header('token' , '')
        res.status(200).json({msg:"Log Out successfully"})
    } catch (error) {
        console.error(error)
        res.status(500).send("Internal error")
    }
}
let UpgradeToSeller = async (req, res) => {
    try {
        const user = await User.findById({ _id: req.params.id })
        if (!user) {
            return res.status(404).send("user not found ")
        }
        if (user.role === 'seller') {
            return res.status(404).send("user is already seller")
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
        res.status(200).json({
            msg: "success task",
            user
        })
    } catch (error) {
        console.error(error)
        res.status(500).send("Internal error")
    }
}
let UpgradeToAdmin = async(req,res)=>{
    try {
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

    } catch (error) {
        console.error(error)
        res.status(500).send("Internal error")
    }
}
let deletedUser = async (req,res)=>{
    try {
        const userId = req.params.id
        const user = await User.findByIdAndDelete(userId)
        if (!user){
            return res.status(404).json({msg:"user already deleted"})
        }
        if (user.role === 'seller'){
            await Seller.deleteOne(
                {_id : userId },
            )
        }
        res.status(200).json("deleted successfully")
    } catch (error) {
        console.error(error)
        res.status(500).send("Internal error")
    }
}





module.exports = {
    Register,
    Login,
    UpgradeToSeller,
    deletedUser,
    UpgradeToAdmin,
    Logout
}