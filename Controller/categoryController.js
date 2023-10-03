const categoryModel = require("../Model/categoryModel")
const asyncWrapper =require("../Util/asyncWrapper")
const appError = require("../Util/appError")
const httpStatusText = require("../Util/httpStatusText")

let addCategory = asyncWrapper(async(req,res,next)=>{
    const {name , description} = req.body 
    const category = await categoryModel.findOne({name : name})
    if (category){
        const error =  appError.createError("category already exist", 400, httpStatusText.FAIL)
        return next(error)                }
    const newCategory = new categoryModel({
        name ,
        description
    })
    await newCategory.save() 
    res.status(200).json({status: httpStatusText.SUCCESS,msg:"category created"})
})
let updateCategory = asyncWrapper(async (req,res,next)=>{
    const categoryId = req.params.id
    const {name , description} = req.body 
    const category = await categoryModel.findByIdAndUpdate(categoryId , {
        name ,
        description
    } , { new :true}).select("name description")
    if (!category){
        const error =  appError.createError("category not found", 400, httpStatusText.FAIL)
        return next(error)        
        }
    res.status(200).json({status: httpStatusText.SUCCESS,msg:"updated successfully",category})
} )

let getAllCategory = asyncWrapper(async(req,res,next)=>{
    const categories = await categoryModel.find()
    if (!categories){
        const error =  appError.createError("category not found", 400, httpStatusText.FAIL)
        return next(error)}
    res.status(200).json({status: httpStatusText.SUCCESS,data :{categories}})
})



module.exports = {
    addCategory,
    updateCategory,
    getAllCategory
}