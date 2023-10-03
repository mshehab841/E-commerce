const sellerModel =require("../Model/sellerModel") 
const productModel = require("../Model/productModel")
const asyncWrapper =require("../Util/asyncWrapper")
const appError = require("../Util/appError")
const httpStatusText = require("../Util/httpStatusText")
const calculateRating = require("../Util/calculateRating")


const addRatingToProduct = asyncWrapper(async(req,res,next)=>{
        const productId = req.params.id
        const {rating , review} = req.body
        const customerId = req.user._id
    
        if (!customerId){
            const error =  appError.createError("login first", 400, httpStatusText.FAIL)
            return next(error)        
        }
        let product = await productModel.findById(productId)
        if(!product){
            const error =  appError.createError("product not found", 400, httpStatusText.FAIL)
            return next(error)       
         }
        const newRating = {
            customerId,
            rating,
            review
        }
        product.ratings.push(newRating);
        await product.save()
        const totalRating =  calculateRating(product.ratings)
        product.totalRate = totalRating 
        await product.save()
        res.status(200).json({status: httpStatusText.SUCCESS,msg:"successfully add"})
})

const addRatingToSeller = asyncWrapper(async(req,res,next)=>{
    const sellerId = req.params.id
    const {rating , review} = req.body
    const customerId = req.user._id
    let seller = await sellerModel.findById(sellerId)
    if (!seller){
        const error =  appError.createError("seller not found", 400, httpStatusText.FAIL)
        return next(error)    
    }
    const newRating = {
       customerId : {
        customer : customerId,
        rate : rating,
        review
       },  
    }
    seller.ratings.push(newRating)
    await seller.save()
    res.status(200).json({status: httpStatusText.SUCCESS , newRating})
})
const sellerRating = asyncWrapper(async (req,res,next)=>{
    const sellerId = req.user._id
    const seller = await sellerModel.findById(sellerId)
    if(!seller){
        const error =  appError.createError("seller not found", 400, httpStatusText.FAIL)
        return next(error)       
     }
    const rating = seller.ratings
    res.status(200).json(rating)
})
const productRating =asyncWrapper( async (req,res,next)=>{
    const productId = req.params.id
    const product = await productModel.findById(productId)
    if(!product){
        const error =  appError.createError("product not found", 400, httpStatusText.FAIL)
        return next(error)        
    }
    const rating = product.ratings
    const totalRate = product.totalRate
    res.status(200).json({msg:`total rate is ${totalRate} ` , rating})
})

    
    
 module.exports={
 addRatingToProduct,
 addRatingToSeller,
 sellerRating,
 productRating
}