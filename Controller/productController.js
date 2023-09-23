const productModel = require("../Model/productModel")
const  Seller = require("../Model/sellerModel")
const categoryModel = require("../Model/categoryModel")
const Customer = require("../Model/userModel")
const OrderItem = require("../Model/Order-ItemModel")

let addProduct = async(req,res)=>{
    try {
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
            msg : "Add Product Successfully"
        })
    } catch (error) {
        console.error(error)
        res.status(500).send("Internal Error")
    }
}


let deleteProduct = async(req,res)=>{
    try {
        const productId = req.params.id
        let product = await productModel.findByIdAndRemove(productId)

        if(!product){
            return res.status(404).json({data:"product already deleted"})
        }
        // if you delete product you should change product count in seller model

        await OrderItem.deleteMany({ product: productId });

        await Customer.updateMany(
            {"shoppingCart.product" : productId},
            {$pull: {shoppingCart : {product : productId}}}
            )

        const seller = await Seller.findById(product.seller)
        if (!seller){
            return res.status(404).json({data:"seller not found"})
        }
        seller.products = seller.products.filter((productId)=>productId.toString() !== product._id.toString()) 

        seller.productCount -= 1
        await seller.save();
        // delete from category
        const category = await categoryModel.findById(product.category)
        if (!category){
            return res.status(404).json({data:"category not found"})
        }
        category.product = category.product.filter((productId)=>productId.toString() !== product._id.toString())
        await category.save()
        res.status(200).json({msg:"Deleted Successfully"})


    } catch (error) {
        console.error(error)
        res.status(500).send("Internal Error")
    }
}


let updateProduct = async(req,res)=>{
    try {
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
            return res.status(404).json({msg:"product not found"})
        }
        res.status(200).json({msg:"updated successfully " , updateData})
    
    } catch (error) {
        console.error(error)
        res.status(500).send("Internal Error")
    }
}


let getAllProduct = async(req,res)=>{
    try {
        let products = await productModel.find()
        res.status(200).json(products)
    } catch (error) {
        console.error(error)
        res.status(500).send("Internal Error")
    }
}




module.exports = {
    addProduct,
    deleteProduct,
    updateProduct,
    getAllProduct
}