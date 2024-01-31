const { createProductRepo, findProductAndDeleted, updateProductRepo, getAll, findProductById } = require("./product.repo")
const { findSellerById , updateShoppingCart } = require("../user/user.repo")
const { findCategoryById } = require("../category/category.repo")
const Redis = require('../../Util/Redis')

module.exports = {
    createProduct : async(product , sellerId , Image)=>{
    // { Name , Description , Price , category}
    const newProduct = {
        Name  : product.Name,
        Description  : product.Description,
        Price : product.Price,
        Image,
        seller : [sellerId] ,
        category  : product.category, 
    }
    await createProductRepo(newProduct)
    
   const sellerData = await findSellerById(sellerId)
   // when add a new product must send some info to user like product count for spacfic user and id 
   sellerData.products.push(newProduct._id)
   sellerData.productCount += 1
   await sellerData.save()

    // add product to category
    const addToCategory = await findCategoryById(product.category)
    addToCategory.product.push(newProduct._id)
    await addToCategory.save()
    },
    productDeleted : async(productId)=>{
        let product = await findProductAndDeleted(productId)
        if(!product){
            const error =  appError.createError("Product not found", 400, httpStatusText.FAIL)
            throw next(error)              
        }    
        updateShoppingCart(productId)
        const seller = await findSellerById(product.seller)
        if (!seller){
            const error =  appError.createError("seller not found", 400, httpStatusText.FAIL)
            throw (error)           
         }
        seller.products = seller.products.filter((productId)=>productId.toString() !== product._id.toString()) 
        seller.productCount -= 1
        seller.save();
        const category = await findCategoryById(product.category)
        if (!category){
            const error =  appError.createError("category not found", 400, httpStatusText.FAIL)
            throw (error)  
        }
        category.product = category.product.filter((productId)=>productId.toString() !== product._id.toString())
        category.save()
    },
    updateProductService : async(productId  , newData , updatedImage)=>{
        const {Name ,Price,Description} = newData
        const updateData = await updateProductRepo(productId , updatedImage , {Name ,Price,Description})
        if (!updateData){
            const error =  appError.createError("Product not found", 400, httpStatusText.FAIL)
            throw (error)
        }
        return updateData
    },
    getAllProductService : async ()=>{
        const products = await getAll()
        return products
    },
    getProductByIdService : async(productId)=>{
        // const resultCached = await client.get(`product:${productId}`)
        const resultCached = await Redis.get(productId)
        if (resultCached){
            console.log("from cache")
            return JSON.parse(resultCached)
        }
        const product = await findProductById(productId)
        if (!product){
            const error =  appError.createError("Product not found", 400, httpStatusText.FAIL)
            throw (error)
        }
        const productObject = product.toJSON();

        // Convert the product object to a JSON string
        const productString = JSON.stringify(productObject);
        await Redis.set(productId, productString)
        console.log("from database")
        return product
    }
}
