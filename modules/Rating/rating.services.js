const appError = require("../../Util/appError")
const httpStatusText = require("../../Util/httpStatusText")
const calculateRating = require("../../Util/calculateRating") 
const { findSellerById } = require("../user/user.repo")
const {findProductById} = require("../product/product.model")

const ratingProductServices = async (productId , rating , review , customerId)=>{
    if (!customerId){
        const error =  appError.createError("login first", 400, httpStatusText.FAIL)
        throw (error)        
    }
    let product = await findProductById(productId)
    if(!product){
        const error =  appError.createError("product not found", 400, httpStatusText.FAIL)
        throw (error)       
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
}
const ratingSellerServices = async (sellerId , input , customerId) =>{
    let seller = await findSellerById(sellerId)
    if (!seller){
        const error =  appError.createError("seller not found", 400, httpStatusText.FAIL)
        throw (error)    
    }
    const newRating = {
       customerId : {
        customer : customerId,
        rate : input.rating,
        review : input.review
       },  
    }
    seller.ratings.push(newRating)
    await seller.save()
    return newRating
}
const getSellerRating = async (id)=>{
    const seller = await findSellerById(id)
    if(!seller){
        const error =  appError.createError("seller not found", 400, httpStatusText.FAIL)
        throw (error)       
     }
    const rating = seller.ratings
    return rating
}
const getProductRating = async(id)=>{
    const product = await findProductById(id)
    if(!product){
        const error =  appError.createError("product not found", 400, httpStatusText.FAIL)
        throw (error)        
    }
    return product 
}
module.exports={
    ratingProductServices,
    ratingSellerServices,
    getSellerRating,
    getProductRating
}
