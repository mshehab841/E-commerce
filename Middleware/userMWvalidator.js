const validator = require("../Util/registerValidator")

module.exports = (req,res,next)=>{

    let valid = validator(req.body)
    if (valid) {
        req.valid = 1 
        next()
    }else{
        res.status(400).send("somthing wrong on validator")
    }
}