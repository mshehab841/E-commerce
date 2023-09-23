const express = require("express")
const router = express.Router()
const productController = require("../Controller/productController")
const upload = require("../Middleware/upload")
const authorize = require("../Middleware/Authorization")
const auth = require("../Middleware/Authentication")


router.post("/" ,auth , authorize('seller'), upload.array('Image' , 6),productController.addProduct)
router.delete("/:id" ,auth , authorize('seller') , productController.deleteProduct)
router.put("/:id" ,auth , authorize('seller'), upload.array('Image',6) , productController.updateProduct)
router.get("/" ,productController.getAllProduct)

module.exports = router
