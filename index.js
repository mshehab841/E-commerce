const express = require("express")
const mongoose = require("mongoose")
const httpStatusText = require("./Util/httpStatusText")
const cookieParser = require('cookie-parser')
const passport = require('passport')
const passportSetup = require('./config/passport-google')
const passportFacebook = require('./config/passport-facebook')
require('dotenv').config()

const app = express()

app.set('view engine', 'ejs');
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(passport.initialize())

//routes
const user = require("./Router/Users")
const product = require("./Router/Product")
const customer = require("./Router/Customer")
const Rating = require("./Router/Rating")
const order = require("./Router/Order")
const category = require("./Router/Category")
const payment = require("./Router/Payment")
const auth = require("./Router/GoogleAuth")
const Auth = require("./Router/FacebookAuth")

app.use("/user", user)
app.use("/product", product)
app.use("/customer", customer)
app.use("/rating", Rating)
app.use("/order", order)
app.use("/category", category)
app.use("/payment", payment)
app.use("/auth" , auth)
app.use("/Auth" , Auth)

mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(()=>{
    console.log("Database Connected")
})
.catch(()=>{
    console.log("failed to connect")
})


//error for unknown route
app.all("*",(req,res,next)=>{
    res.status(404).json({status : httpStatusText.FAIL, message : "Route not found"})
})

//asyncWrapper
app.use((error,req,res,next)=>{
    res.status(error.statusCode ||500).
    json({status : error.statusCode || httpStatusText.ERROR,
         message : error.message ,
         code :error.statusCode ||500
        })
})

app.get('/', (req, res) => {
    res.render('home');
});

const port = process.env.port||3000

app.listen(port , ()=>{console.log(`listen to ${port}....`)})