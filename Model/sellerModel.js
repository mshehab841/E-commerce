const mongoose = require('mongoose')

const sellerSchema = new mongoose.Schema({
    name :{
        type :String,
        required:true,
        unique:true,
        minLength:3,
        maxLength:50,
    },
    email :{
        type :String ,
        required:true,
        unique:true,
    },
    password: {
        type :String , 
        required:true,
        minLength:7,

    },
    token: {
      token : String
    },
    products: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Products',
        },
      ],
      productCount: {
        type: Number,
        default: 0, // Initially set to 0
      },
      salesHistory: [
        {
          orderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'order-item',
          },
          
          saleAmount: Number,
          saleDate: {
            type: Date,
            default: Date.now,
          },
        },
      ],
    
    ratings: [
      {
        customerId: {
            customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
          },
            rate:{ 
              type : Number,
            min: 1,
            max: 5,
            required: true,
          },
            review: String, // Optional review text
            Date: {
              type: Date,
              default: Date.now,
            },
          },
        },
      ],
})


const seller = mongoose.model("seller" , sellerSchema)
module.exports = seller