const express = require("express")
const httpStatusText = require('./src/Util/httpStatusText')
const cookieParser = require('cookie-parser')
const passport = require('passport')
const passportSetup = require('./src/config/passport-google')
const passportFacebook = require('./src/config/passport-facebook')
const db = require('./src/DB/connection')
require('dotenv').config()

const app = express()

app.set('view engine', 'ejs');
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(passport.initialize())




const combinedRoutes = require("./src/Routes/index")


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
