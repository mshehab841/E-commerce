const asyncWrapper =require("../../Util/asyncWrapper")
const { addToCartServices, getAllItemService , deleteItemService } = require("./cart.services")
const httpStatusText = require("../../Util/httpStatusText")


const addToCart = asyncWrapper(async(req,res,next)=>{
    const productId = req.params.id
    await addToCartServices(productId)
    res.status(200).json({status: httpStatusText.SUCCESS,msg:"successfully add"})
})


const getAllItem = asyncWrapper(async(req,res,next)=>{
    const customerId =  req.user._id
    const items = await getAllItemService(customerId)
    res.status(200).json(items)
})


const deleteItem = asyncWrapper(async(req,res,next)=>{
    let itemId = req.params.id
    const customerId = req.user._id
    await deleteItemService(customerId , itemId)
    res.json({msg : "deleted success"})
}
)




module.exports={
addToCart,
getAllItem,
deleteItem,
}