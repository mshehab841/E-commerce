const express = require("express")
const router = express.Router()
const userController = require("./user.controller")
const authorize = require("../../Middleware/Authorization")
const auth = require("../../Middleware/Authentication")


router.post("/Register" ,  userController.Register)
router.post("/Login" , userController.Login)
router.post("/Logout" , userController.Logout)
router.put("/upgradeToSeller/:id" ,auth, authorize('admin'), userController.UpgradeToSeller)
router.put("/upgradeToAdmin/:id" ,auth, authorize('admin'), userController.UpgradeToAdmin)
router.delete("/:id" , auth , authorize('admin') , userController.deletedUser)
router.put("/verifyEmail" , userController.verifyEmailController)


module.exports = router 
