const asyncWrapper =require("../../Util/asyncWrapper")
const httpStatusText = require("../../Util/httpStatusText")
const { createProduct  , productDeleted  , getAllProductService , updateProductService , getProductByIdService} = require("./product.services")


let addProduct = asyncWrapper(async(req,res,next)=>{
    const  product = req.body
    const Image = req.files.map((file) => file.path)
    const sellerId = req.user._id
    await createProduct(product , sellerId , Image)
    res.status(200).json({
        status: httpStatusText.SUCCESS,
        msg : "Add Product Successfully"
    })
})

let deleteProduct = asyncWrapper(async(req,res,next)=>{
    const productId = req.params.id
    await productDeleted(productId)
    res.status(200).json({status: httpStatusText.SUCCESS,msg:"Deleted Successfully"})
})

let updateProduct = asyncWrapper(async(req,res,next)=>{
    const productId = req.params.id
    const newData = req.body
    const updatedImage = req.files.map((file)=>file.path)
    const updateData = await updateProductService(productId , updatedImage , newData)
    res.status(200).json({status: httpStatusText.SUCCESS ,msg:"updated successfully " , updateData})
})

let getAllProduct = asyncWrapper(async(req,res,next)=>{
    let products = await getAllProductService()
    res.status(200).json(products)
})
let getProductById = asyncWrapper(async(req,res,next)=>{
    const productId = req.params.id
    let products = await getProductByIdService(productId)
    res.status(200).json(products)
})



module.exports = {
    addProduct,
    deleteProduct,
    updateProduct,
    getAllProduct,
    getProductById
}