const { findProductById } = require("../product/product.repo");
const appError = require("../../Util/appError")
const httpStatusText = require("../../Util/httpStatusText");
const { createOrderItem, findOrderById, findAndDelete, findSellerOrders } = require("./order.repo");

module.exports ={
    createOrder : async(customer , input)=>{
        if (!customer) {
            return res.status(404).json({ msg: "register first" });
          }
      
          const orderItems = [];
          let totalPrice = 0;
      
          for (const item of input.items) {
            const product = await findProductById(item.product);
      
            if (!product) {
                const error = appError.createError(
                    "product not found",
                    400,
                    httpStatusText.FAIL
                );
                throw error;           
            }
      
            const itemTotalPrice = item.quantity * product.Price;
      
            const OrderItem = {
              product: item.product,
              quantity: item.quantity,
              price: product.Price,
              totalAmount: itemTotalPrice,
              seller: product.seller,
            };
      
            const newOrder = await createOrderItem(OrderItem)
            orderItems.push(newOrder._id);
      
            totalPrice += itemTotalPrice;
          }
      
          const order = new orderModel({
            orderItem: orderItems,
            customer: customer._id,
            shippingAddress: {
              street : input.street,
              city : input.city,
              zipCode : input.zipCode,
            },
            status : input.status,
            totalPrice: totalPrice,
          });
          await order.save();
          // after order info finished should record order in customer ordering
          let oldCustomer = await customerModel.findById(customer._id);
      
          oldCustomer.orders.push(order);
          await oldCustomer.save();
          return order
    },
    orderCancelled : async (orderId)=>{
      const order = await findOrderById(orderId)
      if (!order) {
        const error = appError.createError(
          "order not found",
          400,
          httpStatusText.FAIL
      );
      throw error;       
    }
      if (order.status !== "Pending") {
        const error = appError.createError(
          "order can not be cancelled",
          400,
          httpStatusText.FAIL
      );
      throw error; 
      }
      order.status = "Cancelled";
      await order.save();
    },
    orderDeleted : async(orderId , customerId)=>{
      const order = await findAndDelete(orderId)
      if (!order) {
        const error = appError.createError(
          "order not found",
          400,
          httpStatusText.FAIL
      );
      throw error;       
      }
      for (const orderItemId of order.orderItem) {
        await findOrderItemAndDelete(orderItemId)
      }
      await customerModel.updateOne(
        { _id: customerId },
        { $pull: { orders: { _id: orderId } } }
      );
    },
    Shipped : async(orderId)=>{
      const order = await findOrderById(orderId)
      if (!order) {
        const error = appError.createError(
          "order not found",
          400,
          httpStatusText.FAIL
      );
      throw error;   
      }
      if (order.status !== "Pending") {
        const error = appError.createError(
          "order can not be shipped",
          400,
          httpStatusText.FAIL
      );
      throw error;         
    }
      order.status = "Shipped";
      await order.save();
    },
    Delivered : async(orderID)=>{
      const order = await findOrderById(orderID)
      if (!order) {
        const error = appError.createError(
          "order not found",
          400,
          httpStatusText.FAIL
          );
          throw error; 
      }
      if (order.status !== "Shipped") {
        const error = appError.createError(
          "order can not be delivered",
          400,
          httpStatusText.FAIL
          );
          throw error;
      }
      order.status = "Delivered";
      await order.save();
    },
    SellerOrder : async(sellerId)=>{
    const orders = await findSellerOrders(sellerId)
    if (!orders) {
        const error = appError.createError(
          "order not found",
          400,
          httpStatusText.FAIL
          );
          throw error;
    }
    return orders
    }
}