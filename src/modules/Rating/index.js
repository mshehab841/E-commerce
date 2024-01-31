const express = require("express")
const router = express.Router()
const auth = require("../../Middleware/Authentication")
const ratingController = require("./rating.controller")
const authorize = require("../../Middleware/Authorization")


router.post("/product/:id" ,auth,authorize('customer') ,ratingController.addRatingToProduct)
router.post("/seller/:id" ,auth,authorize('customer'), ratingController.addRatingToSeller)
router.get("/:id", auth, authorize('seller') ,ratingController.sellerRating )
router.get("/productRate/:id",  ratingController.productRating )

module.exports = router