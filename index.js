const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const cookieParser = require('cookie-parser')
const helmet = require('helmet')
const passport = require('passport')
const passportSetup = require('./config/passport-google')
const passportFacebook = require('./config/passport-facebook')
const dotenv = require('dotenv')

const app = express()

app.set('view engine', 'ejs');

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(helmet())
app.use(passport.initialize())

const user = require("./Router/Users")
const product = require("./Router/Product")
const customer = require("./Router/Customer")
const Rating = require("./Router/Rating")
const order = require("./Router/Order")
const category = require("./Router/Category")
const payment = require("./Router/Payment")
const auth = require("./Router/GoogleAuth")
const Auth = require("./Router/FacebookAuth")

dotenv.config()

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

app.use("/user", user)
app.use("/product", product)
app.use("/customer", customer)
app.use("/rating", Rating)
app.use("/order", order)
app.use("/category", category)
app.use("/payment", payment)
app.use("/auth" , auth)
app.use("/Auth" , Auth)

app.get('/', (req, res) => {
    res.render('home');
});

const port = process.env.port||3000

app.listen(port , ()=>{console.log(`listen to ${port}....`)})