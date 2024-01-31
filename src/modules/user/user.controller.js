const jwt = require("jsonwebtoken");
const asyncWrapper = require("../../Util/asyncWrapper");
const httpStatusText = require("../../Util/httpStatusText");
const {
  createUser,
  loginServices,
  upgradeSellerServices,
  upgradeAdminServices,
  deleteServices,
} = require("./user.services");

let Register = asyncWrapper(async (req, res, next) => {
  const user = req.body;
  await createUser(user);
  res.status(200).json({ msg: "Register Successfully  ,please check your email" });
});
let verifyEmailController = asyncWrapper(async (req, res, next) => {
  const token = req.query.token;
  await verifyEmail(token);
  res.status(200).json({ msg: "verify Email Successfully" });
});
let Login = asyncWrapper(async (req, res, next) => {
  let userInput = req.body;
  const user = await loginServices(userInput ,next);
  const token = jwt.sign(
    { _id: user._id, role: user.role },
    process.env.jwt_secret_key
  );
  res.header("token", token);
  res.cookie("jwt", token);
  res.status(200).json({ status: httpStatusText.SUCCESS, user });
});
let Logout = asyncWrapper((req, res, next) => {
  res.cookie("jwt", "");
  res.header("token", "");
  res
    .status(200)
    .json({ status: httpStatusText.SUCCESS, msg: "Log Out successfully" });
});
let UpgradeToSeller = asyncWrapper(async (req, res, next) => {
  const id = req.params.id;
  const user = await upgradeSellerServices(id);
  res.status(200).json({ status: httpStatusText.SUCCESS, user });
});
let UpgradeToAdmin = asyncWrapper(async (req, res, next) => {
  const userId = req.params.id;
  const user = await upgradeAdminServices(userId);
  res.status(200).json(user);
});
let deletedUser = asyncWrapper(async (req, res, next) => {
  const userId = req.params.id;
  await deleteServices(userId);
  res.status(200).json("deleted successfully");
});

module.exports = {
  Register,
  Login,
  UpgradeToSeller,
  deletedUser,
  UpgradeToAdmin,
  Logout,
  verifyEmailController
};
