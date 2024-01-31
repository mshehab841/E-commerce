const bcrypt = require("bcrypt")
const appError = require("../../Util/appError")
const httpStatusText = require("../../Util/httpStatusText")
const {findUserByEmail , createUserRepo, findUserById, deleteUser, deleteFromSeller} = require("./user.repo")
const { sendVerificationEmail  , verificationToken} = require("../../Util/sendEmail")

const createUser = async (user) => {
    let userExit = await findUserByEmail(user.email)
    if (userExit) {
        const error = appError.createError("Email already exist", 400, httpStatusText.FAIL)
        throw (error)
    }
    const sault = await bcrypt.genSalt(10)
    let hashPassword = await bcrypt.hash(user.password, sault)

    const newUser = {
        name: user.name,
        email: user.email,
        password: hashPassword,
        role: user.role
    }
    await createUserRepo(newUser)
    const token = await verificationToken(user._id)
    sendVerificationEmail(user.email ,5 ,  token)
}
const verifyEmail = async(token)=>{
    const decoded = jwt.verify(token, process.env.jwt_secret_key)
    const user = await findUserById(decoded._id)
    if (!user) {
        const error = appError.createError("This user does not exist", 400, httpStatusText.FAIL)
        throw (error)
    }
    if (user.verified) {
        const error = appError.createError("This email is already verified", 400, httpStatusText.FAIL)
        throw (error)   
    }else{
        user.verified = true
        await user.save()
    }
}
const loginServices = async (user , next) => {
    let userFound = await findUserByEmail(user.email)
    if (!userFound) {
        const error = appError.createError("This email does not exist", 400, httpStatusText.FAIL)
        throw error
    }
    let checkPassword = await bcrypt.compare(user.password, userFound.password)
    if (!checkPassword) {
        const error = appError.createError("Password does not match", 400, httpStatusText.FAIL)
        throw error
    }
    return userFound

}
const upgradeSellerServices = async (id) => {
    const user = await findUserById(id)
    if (!user) {
        const error = appError.createError("This user does not exist", 400, httpStatusText.FAIL)
        throw (error)
    }
    if (user.role === 'seller') {
        const error = appError.createError("This user is already a seller", 400, httpStatusText.FAIL)
        throw (error)
    }
    //send data at seller database 
    const newSeller = {
        _id: user._id,
        name: user.name,
        email: user.email,
        password: user.password,
    }
    await createUserRepo(newSeller)
    user.role = 'seller'
    await user.save()
    return user
}
const upgradeAdminServices = async (id) => {
    const user = await findUserById(id)
    if (user.role === 'seller') {
        await deleteFromSeller(user._id)
    }
    user.role = 'admin'
    await user.save()
    return user
}
const deleteServices = async (id) => {
    const user = await deleteUser(id)
    if (!user) {
        const error = appError.createError("This user does not exist", 400, httpStatusText.FAIL)
        throw (error)
    }
    if (user.role === 'seller') {
        await deleteFromSeller(id)
    }
}
module.exports = {
    createUser,
    loginServices,
    upgradeSellerServices,
    upgradeAdminServices,
    deleteServices,
    verifyEmail
}