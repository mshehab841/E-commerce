const mongoose = require("mongoose")

const auditModel = new mongoose.Schema({
    audit_action: {
        type: String,
        required: true
    },
    audit_data: {
        type: String,
    },
    error: {
        type: String,
    },
    audit_by : {
        type: String,
        required: true
    },
    Date: {
        type: Date,
        default: Date.now
    },
})
const audit = mongoose.model("audit", auditModel)

module.exports = audit