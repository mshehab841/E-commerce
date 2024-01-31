const orderItem = require("./order.item.model")
const orderModel = require("./order.model")
module.exports={
    createOrderItem : (order)=>{
        return orderItem.create(order)
    },
    findOrderById : (orderId)=>{
        return orderModel.findById(orderId)
    },
    findAndDelete :(orderId)=>{
        return orderModel.findByIdAndDelete(orderId)
    },
    findOrderItemAndDelete : (orderItemId)=>{
        return orderItem.findByIdAndDelete(orderItemId)
    },
    findSellerOrders : (sellerID)=>{
        return orderModel.find({seller : sellerID}).populate("customer" ,"name").sort("timestamp")
    }
}