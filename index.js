const express = require("express")
const httpStatusText = require("./Util/httpStatusText")
const cookieParser = require('cookie-parser')
const passport = require('passport')
const passportSetup = require('./config/passport-google')
const passportFacebook = require('./config/passport-facebook')
const db = require('./DB/connection')
require('dotenv').config()

const app = express()

app.set('view engine', 'ejs');
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(passport.initialize())


const combinedRoutes = require("./Routes/index")


app.use('/v1' , combinedRoutes )

db()
//error for unknown route
app.all("*",(req,res,next)=>{
    res.status(404).json({status : httpStatusText.FAIL, message : "Route not found"})
})

//asyncWrapper
app.use((error,req,res,next)=>{
    res.status(error.statusCode ||500).json({status : error.statusText || httpStatusText.ERROR,message : error.message ,code :error.statusCode ||500 })
})

app.get('/', (req, res) => {
    res.render('home');
});

const port = process.env.port||3000

app.listen(port , ()=>{console.log(`listen to ${port}....`)})
