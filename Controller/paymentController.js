const paymentModel = require("../Model/paymentModel")
const orderModel  = require("../Model/orderModel")
const orderItemModel = require("../Model/Order-ItemModel")
const sellerModel = require("../Model/sellerModel")
let successPayment = async (req,res)=>{
    try {
        const orderId = req.params.id 
        const order = await orderModel.findById(orderId)
        if (!order){
            return res.status(404).json({msg:"order not found"})
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
        res.status(200).json(newPayment)
    } catch (error) {
        console.error(error)
        res.status(500).send("Internal Error")
    }
}

let failedOrder = async (req,res)=>{
    try {
        const orderId =  req.params.id 
        const order = await orderModel.findById(orderId)
         if (!order){
            return res.status(404).json({msg:"order not found "})
         }
        const payment = new paymentModel({
            order ,
            status : 'Failed'
        })
        await payment.save()

        res.status(200).json({msg:"payment Failed Something wrong", payment })
    } catch (error) {
        console.error(error)
        res.status(500).send("Internal Error")
    }
}
module.exports = {
    successPayment,
    failedOrder
}