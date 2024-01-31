const orderModel = require("./order.model");
const asyncWrapper =require("../../Util/asyncWrapper")
const { createOrder, orderCancelled, orderDeleted, Shipped  ,Delivered, SellerOrder} = require("./order.services");

const makeOrder = asyncWrapper(async (req, res) => {
    const customer = req.user;
    const order = req.body;
    const newOrder = await createOrder(customer ,  order )
    res.status(200).json({ msg: "order successfully Created", newOrder });
})
const CancelledOrder = asyncWrapper(async (req, res) => {
  const orderId = req.params.id;
  await orderCancelled(orderId)
  res.status(200).json({ msg: "Order Canceled Successfully" });
})
const deleteOrder = asyncWrapper(async (req, res) => {
  const orderId = req.params.id;
  const customerId = req.user._id;
  await orderDeleted(orderId , customerId )
  res.status(200).json({ msg: "Deleted successfully" });
})
const makeOrderAsShipped = asyncWrapper(async (req, res) => {
  const orderId = req.params.id;
  await Shipped(orderId)
  res.status(200).json({ msg: "status transfer Successfully" });
})
const makeOrderAsDelivered = asyncWrapper(async (req, res) => {
  const orderId = req.params.id;
  await Delivered(orderId)
  res.status(200).json({ msg: "status transfer Successfully" });
})
const getSellerOrder = asyncWrapper(async (req, res) => {
  const sellerId = req.user._id;
  const orders = await SellerOrder(sellerId)
  res.status(200).json({ msg: "your Order", orders });
})

module.exports = {
  makeOrder,
  CancelledOrder,
  makeOrderAsShipped,
  makeOrderAsDelivered,
  getSellerOrder,
  deleteOrder,
};
