const userModel = require("./user.model")
const sellerModel = require("./seller.model")
module.exports = {
    findUserByEmail : (email)=>{
        return userModel.findOne({email})
    },
    findSellerById : (id)=>{
        return sellerModel.findById(id)
    },
    createUserRepo : (user) =>{
        return  userModel.create(user)
    },
    findUserById : (id)=>{
        return userModel.findById(id)
    },
    deleteFromSeller : (id)=>{
        return sellerModel.deleteOne({_id : id})
    },
    deleteUser : (id)=>{
        return userModel.findByIdAndDelete(id) 
    },
    updateShoppingCart : (productId)=>{
        userModel.updateMany( {"shoppingCart.product" : productId}, {$pull: {shoppingCart : {product : productId}}} )
    }
}