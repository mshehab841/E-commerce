const express = require("express")
const router = express.Router()
const productController = require("./product.controller")
const upload = require("../../Middleware/multer")
const authorize = require("../../Middleware/Authorization")
const auth = require("../../Middleware/Authentication")


router.post("/" ,auth , authorize('seller'), upload.array('Image' , 6),productController.addProduct)
router.delete("/:id" ,auth , authorize('seller') , productController.deleteProduct)
router.put("/:id" ,auth , authorize('seller'), upload.array('Image',6) , productController.updateProduct)
router.get("/" ,productController.getAllProduct)
router.get('/:id' , productController.getProductById)

module.exports = router
