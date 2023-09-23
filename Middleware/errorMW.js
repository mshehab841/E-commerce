//Error-handling
module.exports = (req,res,err,next)=> {
    res.status(500).send("Internal error")
    console.error(err)
}