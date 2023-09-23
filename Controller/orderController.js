const orderModel = require("../Model/orderModel")
const productModel = require("../Model/productModel")
const orderItemsModel = require("../Model/Order-ItemModel")
const customerModel = require("../Model/userModel")

const makeOrder = async (req, res) => {
    try {
        const customer = req.user
        const customerId = req.user._id

        const {items, street, zipCode, city, status } = req.body

        if (!customer) {
            return res.status(404).json({ msg: "register first" })
        }

       
        const orderItems = [];
        let totalPrice = 0;

        for (const item of items) {
            const product = await productModel.findById(item.product);

            if (!product) {
                return res.status(404).json({ msg: "Product not found" });
            }

            const itemTotalPrice = item.quantity * product.Price;

            const OrderItem = new orderItemsModel({
                product: item.product,
                quantity: item.quantity,
                price: product.Price, 
                totalAmount: itemTotalPrice, 
                seller :product.seller
            });

            await OrderItem.save();
            orderItems.push(OrderItem._id);

            totalPrice += itemTotalPrice;
        }
      
        const order = new orderModel({
            orderItem: orderItems, 
            customer: customerId,
            shippingAddress: {
                street,
                city,
                zipCode,
            },
            status,
            totalPrice: totalPrice,
          
        })
        await order.save()
        res.status(200).json({ msg: "order successfully", order })

        // after order info finished should record order in customer ordering 
       

        let oldCustomer = await customerModel.findById(customerId)

       
        oldCustomer.orders.push(order)
        await oldCustomer.save()

    } catch (error) {
        console.error(error)
        res.status(500).send("Internal Error")
    }
}
const CancelledOrder = async(req,res)=>{
try {
    const orderId = req.params.id 

    const order = await orderModel.findById(orderId)
    if (!order){
        return res.status(404).json({msg:"order not found"})
    }
    if (order.status !== 'Pending'){
        return res.status(404).json({msg:"order can not canceled "})
    }
    order.status = 'Cancelled'
    await order.save()
    res.status(200).json({msg:"Order Canceled Successfully"})

} catch (error) {
    console.error(error)
    res.status(500).send("Internal Error")
}
}
const deleteOrder = async(req,res)=>{
    try {
        const orderId = req.params.id
        const customerId = req.user._id
        const order = await orderModel.findByIdAndDelete(orderId)
        if (!order){
            return res.status(404).json({msg:"order not found"})
        }
        for (const orderItemId of order.orderItem){
            await orderItemsModel.findByIdAndDelete(orderItemId)
        }
        await customerModel.updateOne(
            {_id : customerId},
            {$pull : {orders :{_id:orderId} }}
        )
        
        res.status(200).json({msg:"Deleted successfully"})
    } catch (error) {
        console.error(error)
        res.status(500).send("Internal Error")
    }
}
const makeOrderAsShipped = async(req,res)=>{
    try {
        const orderId = req.params.id 
    
        const order = await orderModel.findById(orderId)
        if (!order){
            return res.status(404).json({msg:"order not found"})
        }
        if (order.status !== 'Pending'){
            return res.status(404).json({msg:"order can not Shipped "})
        }
        order.status = 'Shipped'
        await order.save()
        res.status(200).json({msg:"status transfer Successfully"})
    
    } catch (error) {
        console.error(error)
        res.status(500).send("Internal Error")
    }
}
const makeOrderAsDelivered = async(req,res)=>{
    try {
        const orderId = req.params.id 
    
        const order = await orderModel.findById(orderId)
        if (!order){
            return res.status(404).json({msg:"order not found"})
        }
        if (order.status !== 'Shipped'){
            return res.status(404).json({msg:"order can not be delivery "})
        }
        order.status = 'Delivered'
        await order.save()
        res.status(200).json({msg:"status transfer Successfully"})
    
    } catch (error) {
        console.error(error)
        res.status(500).send("Internal Error")
    }
}
const getSellerOrder = async(req,res)=>{
    try {
        const sellerId = req.user._id 
        const orders = await orderModel.find({seller : sellerId}).populate('customer' , 'name').sort('timestamp')
        if (!orders){
            return res.status(404).json({msg:"no order yet"})
        }
        res.status(200).json({msg:"your Order" , orders})
    } catch (error) {
        console.error(error)
        res.status(500).send("Internal Error")
    }
}

module.exports = {
    makeOrder,
    CancelledOrder,
    makeOrderAsShipped,
    makeOrderAsDelivered,
    getSellerOrder,
    deleteOrder
}