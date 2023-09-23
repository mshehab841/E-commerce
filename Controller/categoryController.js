const categoryModel = require("../Model/categoryModel")


let addCategory = async(req,res)=>{
    try {
        const {name , description} = req.body 
        const category = await categoryModel.findOne({name : name})
        if (category){
            return res.status(404).json({msg:"category already exit"})
        }
        const newCategory = new categoryModel({
            name ,
            description
        })
        await newCategory.save() 
        res.status(200).json({msg:"category created"})
    } catch (error) {
        console.error(error)
        res.status(500).send("Internal Error")
    }
}
let updateCategory = async (req,res)=>{
    try {
        const categoryId = req.params.id
        const {name , description} = req.body 
        const category = await categoryModel.findByIdAndUpdate(categoryId , {
            name ,
            description
        } , { new :true}).select("name description")
        if (!category){
            return res.status(404).json({msg:"not found category"})
        }
        res.status(200).json({msg:"updated successfully",category})

    } catch (error) {
        console.error(error)
        res.status(500).send("Internal Error")
    }
} 

let getAllCategory = async(req,res)=>{
    try {
        const categories = await categoryModel.find()
        if (!categories){
            return res.status(404).json({msg:"categories is empty"})
        }
        res.status(200).json(categories)
    } catch (error) {
        console.error(error)
        res.status(500).send("Internal Error")
    }
}



module.exports = {
    addCategory,
    updateCategory,
    getAllCategory
}