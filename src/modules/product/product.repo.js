const product = require("./product.model")

module.exports = {
    findProductById : (id)=>{
        return product.findById(id)
    },
    getAll : ()=>{
        return product.find()
    },
    createProductRepo : (data)=>{
        return product.create(data)
    },
    findProductAndDeleted  : (id)=>{
        return product.findByIdAndDelete(id)
    },
    updateProductRepo : (id , updatedImage , { Name , Description , Price } )=>{
       return  product.findByIdAndUpdate(id,{
            Name,
            Description,
            Price,
            push : {Image :{$each : updatedImage}}
        },
        {new : true}
        )
    }
}