const mongoose = require('mongoose')


const product = new mongoose.Schema({
   Name:{
    type:String,
    required :true
   },
   category : {
    type : mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
   },
   seller:{
    type : mongoose.Schema.Types.ObjectId,
    ref :'seller',
    required:true
   },
   Description:String,

   Price:{
    type:Number,
    required:true
   },
   Image: [String],
   Date:{
      type: Date,
      default: Date.now
   },
   ratings: [
      {
        customerId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        
        rating: {
          type: Number,
          min: 1,
          max: 5,
          required: true,
        },
        review: String, // Optional review text
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    totalRate: {
      type:Number,
      default : 0 , 
    },
    
})
const Products = mongoose.model("Product" , product)
module.exports = Products