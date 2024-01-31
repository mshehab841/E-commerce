const mongoose = require("mongoose")

const order_item  = new mongoose.Schema({
  
    product:[{
        type : mongoose.Schema.Types.ObjectId , 
        ref : 'Products',
        required : true
        
    }],
    seller: {
        type : mongoose.Schema.Types.ObjectId , 
        ref : 'seller', 
       },
    quantity : {
        type : Number ,
        required: true,
        min: 1,
    },
    price :{
        type: Number,
    required: true,
    min: 0,
    },
    totalAmount :{
        type :Number
    }     
 })
 const orderItem = mongoose.model("order-item" , order_item)
 module.exports = orderItem 
