var mongoose = require('mongoose');

//Employee Schema
var employeeSchema = mongoose.Schema({
    employee_id: {
        type: String,
        unique: true
    },
    name: String, 
    email: String,
    mobile: String,
    image: String,
    password: String
});

module.exports = mongoose.model('Employee', employeeSchema);