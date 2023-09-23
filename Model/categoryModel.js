const mongoose = require("mongoose")

const categorySchema = new mongoose.Schema({
   product: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Products'
   }],
   name: String,
   Date: {
      type: Date,
      default: Date.now
   },
   description: String , 

})
const Category = mongoose.model("categories", categorySchema)

module.exports = Category