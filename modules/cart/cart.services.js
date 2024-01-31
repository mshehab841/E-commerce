const { findProductById } = require("../product/product.repo");
const { findUserById } = require("../user/user.repo");
const appError = require("../../Util/appError")
const httpStatusText = require("../../Util/httpStatusText")

module.exports = {
    addToCartServices: async (productId) => {
        const product = await findProductById(productId);
        if (!product) {
            const error = appError.createError(
                "product not found",
                400,
                httpStatusText.FAIL
            );
            throw error;
        }
        const customerId = req.user._id;
        // Find the customer based on their ID
        const customer = await findUserById(customerId);

        if (!customer) {
            const error = appError.createError(
                "customer not found",
                400,
                httpStatusText.FAIL
            );
            return error;
        }
        const item = {
            product: {
                product: product._id,
                name: product.Name,
                description: product.Description,
                price: product.Price,
            },
            quantity: 1, // You can specify the quantity as needed
        };
        customer.shoppingCart.push(item.product);
        await customer.save();
    },
    getAllItemService : async(customerId)=>{
        let customer = await findUserById(customerId)
        if (!customer){
            const error =  appError.createError("customer not found", 400, httpStatusText.FAIL)
            throw (error)    
        }
        const items = customer.shoppingCart
        return items
    },
    deleteItemService : async(customerId , itemId)=>{
        let customer = await findUserById(customerId)
        if(!customer){
            const error =  appError.createError("customer not found", 400, httpStatusText.FAIL)
            throw (error)
        }
        customer.shoppingCart = customer.shoppingCart.filter((item)=> item.product.toString() !== itemId) 
        customer.save()
    }
};
