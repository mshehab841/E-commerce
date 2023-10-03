const productModel = require("../Model/productModel")
const  Seller = require("../Model/sellerModel")
const categoryModel = require("../Model/categoryModel")
const Customer = require("../Model/userModel")
const OrderItem = require("../Model/Order-ItemModel")
const asyncWrapper =require("../Util/asyncWrapper")
const appError = require("../Util/appError")
const httpStatusText = require("../Util/httpStatusText")


let addProduct = asyncWrapper(async(req,res,next)=>{
        const { Name , Description , Price , category} = req.body
        const Image = req.files.map((file) => file.path)
        const sellerId = req.user._id
        const newProduct = new productModel({
            Name,
            Description,
            Price,
            Image,
            seller : [sellerId] ,
            category , 
        })
        await newProduct.save()
        
       const sellerData = await Seller.findById({_id : sellerId})
       // when add a new product must send some info to user like product count for spacfic user and id 
       sellerData.products.push(newProduct._id)
       sellerData.productCount += 1
       await sellerData.save()

        // add product to category
        const addToCategory = await categoryModel.findById(category)
        addToCategory.product.push(newProduct._id)
        await addToCategory.save()
         
        res.status(200).json({
            status: httpStatusText.SUCCESS,
            msg : "Add Product Successfully"
        })
})

let deleteProduct = asyncWrapper(async(req,res,next)=>{
    const productId = req.params.id
    let product = await productModel.findByIdAndRemove(productId)
    if(!product){
        const error =  appError.createError("Product not found", 400, httpStatusText.FAIL)
        return next(error)              
    }
    // if you delete product you should change product count in seller model
    await OrderItem.deleteMany({ product: productId });

    await Customer.updateMany(
        {"shoppingCart.product" : productId},
        {$pull: {shoppingCart : {product : productId}}}
    )
    const seller = await Seller.findById(product.seller)
    if (!seller){
        const error =  appError.createError("seller not found", 400, httpStatusText.FAIL)
        return next(error)           
     }
    seller.products = seller.products.filter((productId)=>productId.toString() !== product._id.toString()) 

    seller.productCount -= 1
    await seller.save();
    // delete from category
    const category = await categoryModel.findById(product.category)
    if (!category){
        const error =  appError.createError("category not found", 400, httpStatusText.FAIL)
        return next(error)  
    }
    category.product = category.product.filter((productId)=>productId.toString() !== product._id.toString())
    await category.save()
    res.status(200).json({status: httpStatusText.SUCCESS,msg:"Deleted Successfully"})
})

let updateProduct = asyncWrapper(async(req,res,next)=>{
    const productId = req.params.id
    const {Name ,Price,Description} = req.body
    const updatedImage = req.files.map((file)=>file.path)

    const updateData = await productModel.findByIdAndUpdate(productId,{
        Name,
        Description,
        Price,
        push : {Image :{$each : updatedImage}}
    },
    {new : true}
    )
    if (!updateData){
        const error =  appError.createError("Product not found", 400, httpStatusText.FAIL)
        return next(error)}
    res.status(200).json({status: httpStatusText.SUCCESS ,msg:"updated successfully " , updateData})
})

let getAllProduct = asyncWrapper(async(req,res,next)=>{
    let products = await productModel.find()
    res.status(200).json(products)

})




module.exports = {
    addProduct,
    deleteProduct,
    updateProduct,
    getAllProduct
}