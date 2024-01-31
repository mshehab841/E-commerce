const asyncWrapper =require("../../Util/asyncWrapper")
const httpStatusText = require("../../Util/httpStatusText")
const { ratingProductServices, getSellerRating, getProductRating } = require("./rating.services")


const addRatingToProduct = asyncWrapper(async(req,res,next)=>{
    const productId = req.params.id
    const {rating , review} = req.body
    const customerId = req.user._id
        
    await ratingProductServices(productId , rating , review , customerId)
    res.status(200).json({status: httpStatusText.SUCCESS,msg:"successfully add"})
})

const addRatingToSeller = asyncWrapper(async(req,res,next)=>{
    const sellerId = req.params.id
    const input = req.body
    const customerId = req.user._id
    const newRating = await ratingSellerServices(sellerId , input , customerId)
    res.status(200).json({status: httpStatusText.SUCCESS , newRating})
})
const sellerRating = asyncWrapper(async (req,res,next)=>{
    const sellerId = req.user._id
    const rating  = await getSellerRating(sellerId)
    res.status(200).json(rating)
})
const productRating =asyncWrapper( async (req,res,next)=>{
    const productId = req.params.id
    const product = await getProductRating(productId)
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