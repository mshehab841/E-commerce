const { verify } = require('jsonwebtoken')
const mongoose = require('mongoose')
const valid = require('validator')

const user = new mongoose.Schema({
    name : String , 
    email :{
        type :String ,
        required:true,
        unique:true,
        validate:{
            validator :(val)=>{return valid.isEmail(val)},
            message :'{value} is not a valid email'}
    },
    password: {
        type :String , 
        minLength:7,
        required(){
            return this.provider === "local"
        }
    },
    dateOfBirth: Date,
    address: {
        street: String,
        city: String,
        zipCode: String,
    },
    phoneNumber: String,
    orders: [
        {
            order :{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Order',
            },
            status : {
                type : String ,
            } ,
        },
    ],
    paymentInfo: {
        cardNumber: String,
        cardExpiry: String,
        cardHolderName: String,
    },
    shoppingCart: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Products',
            },
            quantity: Number,
            name:String,
            price : Number,
            description:String,
            
        },
    ],
    Date :{
        type : Date , 
        default : Date.now
    },
    role : {
        type : String ,
        enum : ["customer" , "seller" , "admin"],
        default : "customer"
    },
    provider:{
        type:String,
        enum : ["google" , "facebook" , "local"],
        default : "local"
    },
    OAuthToken : {
        type : String
    },
    verified : {
        type : Boolean , 
        default : false
    }
})
      
const User = mongoose.model("user" , user)
module.exports = User