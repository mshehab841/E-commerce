const express = require("express")
const router = express.Router()
const orderController = require("./order.controller")
const Auth = require("../../Middleware/Authentication")
const authorize = require("../../Middleware/Authorization")


router.post("/",Auth ,authorize('customer'), orderController.makeOrder)
router.put("/canceled/:id", Auth ,authorize('customer'), orderController.CancelledOrder)
router.put("/shipped/:id", Auth ,authorize('seller'), orderController.makeOrderAsShipped)
router.put("/delivered/:id", Auth ,authorize('seller'), orderController.makeOrderAsDelivered)
router.get("/",Auth,authorize('seller'), orderController.getSellerOrder)
router.delete("/:id" ,Auth,authorize('customer'), orderController.deleteOrder )
module.exports = router
