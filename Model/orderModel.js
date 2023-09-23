const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({
    orderItem :[{
        type : mongoose.Schema.Types.ObjectId , 
        ref : 'orderItem' , 
        required : true

    }],
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending'
    },
    shippingAddress: {
        street: String,
        city: String,
        zipCode: String,
    },
    totalPrice :{
        type : Number
    },
    Date: {
        type: Date,
        default: Date.now
    }
})
const Order = mongoose.model("Order", orderSchema)
module.exports = Order