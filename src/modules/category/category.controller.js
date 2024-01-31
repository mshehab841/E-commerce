const categoryModel = require("./category.model")
const asyncWrapper =require("../../Util/asyncWrapper")
const appError = require("../../Util/appError")
const httpStatusText = require("../../Util/httpStatusText")
const { addCategoryServices, updateCategoryServices , getAllCategoryServices } = require("./category.services")

let addCategory = asyncWrapper(async(req,res,next)=>{
    const {name , description} = req.body 
    await addCategoryServices(name , description)
    res.status(200).json({status: httpStatusText.SUCCESS,msg:"category created"})
})
let updateCategory = asyncWrapper(async (req,res,next)=>{
    const categoryId = req.params.id
    const {name , description} = req.body 
    const category = await updateCategoryServices(categoryId , name , description)
    res.status(200).json({status: httpStatusText.SUCCESS,msg:"updated successfully",category})
} )

let getAllCategory = asyncWrapper(async(req,res,next)=>{
    const categories = await getAllCategoryServices()
    res.status(200).json({status: httpStatusText.SUCCESS,data :{categories}})
})



module.exports = {
    addCategory,
    updateCategory,
    getAllCategory
}