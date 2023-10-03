const paymentModel = require("../Model/paymentModel")
const orderModel  = require("../Model/orderModel")
const orderItemModel = require("../Model/Order-ItemModel")
const sellerModel = require("../Model/sellerModel")
const asyncWrapper =require("../Util/asyncWrapper")
const appError = require("../Util/appError")
const httpStatusText = require("../Util/httpStatusText")

let successPayment =asyncWrapper( async (req,res,next)=>{
    const orderId = req.params.id 
    const order = await orderModel.findById(orderId)
    if (!order){
        const error =  appError.createError("order not found", 400, httpStatusText.FAIL)
        return next(error)                
    }
    const totalPrice = order.totalPrice

    const newPayment = new paymentModel({
        order ,
        status : req.body.status,
        totalPrice
    })
    await newPayment.save()
    if (newPayment.status === 'Success' ){
        if (order.status == 'Pending'){
            order.status = 'Shipped'
            await order.save()
        }
        for (const orderItemId of order.orderItem){
            const orderItem = await orderItemModel.findById(orderItemId)
            const sellerId = orderItem.seller
            const seller = await sellerModel.findById(sellerId)
            seller.salesHistory.push({
                orderId: orderItem._id, 
                saleAmount: orderItem.quantity, 
              });
            await seller.save()
        }
    }
    res.status(200).json({status: httpStatusText.SUCCESS, msg : "payment success",newPayment})
})

let failedOrder = asyncWrapper(async (req,res,next)=>{
    const orderId =  req.params.id 
    const order = await orderModel.findById(orderId)
     if (!order){
        const error =  appError.createError("order not found", 400, httpStatusText.FAIL)
        return next(error)}
    const payment = new paymentModel({
        order ,
        status : 'Failed'
    })
    await payment.save()

    res.status(200).json({status: httpStatusText.SUCCESS,msg:"payment Failed Something wrong", payment })
})
module.exports = {
    successPayment,
    failedOrder
}