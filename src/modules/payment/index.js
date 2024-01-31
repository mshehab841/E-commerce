const express = require("express")
const router = express.Router()
const paymentController = require("./paymentController")

router.post("/:id" , paymentController.successPayment)
router.post("/failed/:id" , paymentController.failedOrder)


module.exports = router