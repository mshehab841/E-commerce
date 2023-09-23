const sellerModel =require("../Model/sellerModel") 
const productModel = require("../Model/productModel")

function calculateRating(ratings){
    if (ratings.length == 0 ){
        return 0
    }
    const totalRating = ratings.reduce((acc, rating) => acc + rating.rating, 0);
    const averageRating = totalRating / ratings.length;
    return Math.round(averageRating*10) / 10
}
const addRatingToProduct = async(req,res)=>{
    try {
        const productId = req.params.id
        const {rating , review} = req.body
        const customerId = req.user._id
    
        if (!customerId){
            return res.status(404).json({msg:"login first"})
        }
    
        let product = await productModel.findById(productId)
        if(!product){
            return res.status(404).json({msg:" product not found "})
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
        res.status(200).json({msg:"successfully add"})
    
    } catch (error) {
        console.error(error)
        res.status(500).send("Internal Error")
    }
}

const addRatingToSeller = async(req,res)=>{
try {
    const sellerId = req.params.id
    const {rating , review} = req.body
    const customerId = req.user._id
    let seller = await sellerModel.findById(sellerId)
    if (!seller){
        return res.status(404).json({msg:"user not found"})
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
    res.status(200).json({msg:"rating successfully" , newRating})

} catch (error) {
    console.error(error)
    res.status(500).send("Internal Error")
}
}
const sellerRating = async (req,res)=>{
    try {
        const sellerId = req.user._id
        const seller = await sellerModel.findById(sellerId)
        if(!seller){
            return res.status(404).json("seller not found")
        }
        
        const rating = seller.ratings
        res.status(200).json(rating)
    } catch (error) {
        console.error(error)
    res.status(500).send("Internal Error")

    }
}
const productRating = async (req,res)=>{
    try {
        const productId = req.params.id
        const product = await productModel.findById(productId)
        if(!product){
            return res.status(404).json("product not found")
        }
        
        const rating = product.ratings
        const totalRate = product.totalRate
        res.status(200).json({msg:`total rate is ${totalRate} ` , rating})
    } catch (error) {
        console.error(error)
    res.status(500).send("Internal Error")

    }
}

    
    
 module.exports={
 addRatingToProduct,
 addRatingToSeller,
 sellerRating,
 productRating
}