class appError extends Error{
    constructor(){
        super()
    }
    createError(message , statusCode , statusText){
        this.message = message
        this.statusCode = statusCode
        this.statusText = statusText
        return this
    }

}
module.exports= new appError()