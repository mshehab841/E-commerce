const event = require('events')
const { statusCode } = require('../../Util/appError')
const auditModel = require("./audit.model")
const audit = new event.EventEmitter()

const auditEvent = "audit"
audit.on(auditEvent, (data) => {
    try {
    auditModel.create(data)
    } catch (error) {
        console.log("audit fail in on " + error)
    }
})

function prepareAudit (action , data , error , user)  {
    const auditData = new auditModel({
        audit_action : action,
        audit_data : data,
        error : error,
        audit_by : user
    })
    audit.emit(auditEvent , auditData) 
}
module.exports = prepareAudit