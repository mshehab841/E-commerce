module.exports = (role) =>{
    return (req,res,next)=>{
        const userRole = req.user.role
        if (userRole !== role){
            console.log(req.user.role)
            console.log(role)
            return res.status(404).json({msg:"Access Denied"})
        }else{
            next()
        }
    }
}