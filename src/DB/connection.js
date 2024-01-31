const mongoose = require('mongoose')
function db (){
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
}

module.exports = db