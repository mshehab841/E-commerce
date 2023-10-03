const CustomerModel =require("../Model/userModel") 
const productModel = require("../Model/productModel")
const asyncWrapper =require("../Util/asyncWrapper")
const appError = require("../Util/appError")
const httpStatusText = require("../Util/httpStatusText")


const addToCart = asyncWrapper(async(req,res,next)=>{
    const productId = req.params.id
    const product =  await productModel.findById(productId)
    if (!product ){
      const error =  appError.createError("product not found", 400, httpStatusText.FAIL)
      return next(error)              
  }
    const customerId = req.user._id;
    // Find the customer based on their ID
    const customer = await CustomerModel.findById(customerId);

    if (!customer) {
      const error =  appError.createError("customer not found", 400, httpStatusText.FAIL)
      return next(error)}
    const item = {
      product :{
          product: product._id,
          name: product.Name,
          description: product.Description,
          price: product.Price,
      },
      quantity: 1, // You can specify the quantity as needed
    }
    customer.shoppingCart.push(item.product )
    await customer.save()
    res.status(200).json({status: httpStatusText.SUCCESS,msg:"successfully add"})
})


const getAllItem = asyncWrapper(async(req,res,next)=>{
    const customerId =  req.user._id

    let customer = await CustomerModel.findById(customerId)
    if (!customer){
        const error =  appError.createError("customer not found", 400, httpStatusText.FAIL)
        return next(error)    
    }
    const items = customer.shoppingCart
    res.status(200).json(items)
})


const deleteItem = asyncWrapper(async(req,res,next)=>{
    let itemId = req.params.id
    const customerId = req.user._id
    let customer = await CustomerModel.findById(customerId)
    if(!customer){
        const error =  appError.createError("customer not found", 400, httpStatusText.FAIL)
        return next(error)}

   customer.shoppingCart = customer.shoppingCart.filter((item)=> item.product.toString() !== itemId) 
    await customer.save()
     res.json({msg : "deleted success"})
}
)




module.exports={
addToCart,
getAllItem,
deleteItem,
}