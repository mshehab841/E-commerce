const category = require("./category.model")

module.exports = {
    findCategoryByName : (name)=>{
        return category.findOne({name})
    },
    findCategoryById : (id)=>{
        return category.findById(id)
    },
    createCategory : (category)=>{
        return category.create(category)
    },
    updateCategory : (id , name , description)=>{
        return category.findByIdAndUpdate(id , {name , description} , {new : true}).select("name description")
    },
    getAllCategory : ()=>{
        return category.find()
    }
}