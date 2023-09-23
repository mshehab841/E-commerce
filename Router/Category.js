const express = require("express")
const router = express.Router()
const categoryController = require("../Controller/categoryController")
const authorize = require("../Middleware/Authorization")
const auth = require("../Middleware/Authentication")

router.post('/', auth ,authorize('admin') , categoryController.addCategory)
router.put("/:id", auth ,authorize('admin') , categoryController.updateCategory)
router.get("/" , categoryController.getAllCategory)


module.exports = router