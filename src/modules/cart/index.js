const express = require("express")
const router = express.Router()
const customerController = require("./cart.controller")
const authorize = require("../../Middleware/Authorization")
const auth = require("../../Middleware/Authentication")




router.post("/:id",auth , authorize('customer'),customerController.addToCart)
router.get("/" , auth ,authorize('customer'), customerController.getAllItem)
router.delete("/:id" , auth ,authorize('customer'), customerController.deleteItem)


module.exports = router