const mongoose = require("mongoose")

const paymentSchema = new mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'order'
    },
    status: {
        type: String,
        enum: ['Pending', 'Success', 'Failed'],
        default: 'Pending'
    },
    Date: {
        type: Date,
        default: Date.now
    },
    totalPrice : Number,

})
const Payment = mongoose.model("payments", paymentSchema)

module.exports = Payment
