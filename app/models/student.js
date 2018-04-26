var mongoose = require('mongoose');

//Employee Schema
var studentSchema = mongoose.Schema({
    student_id: {
        type: String,
        unique: true
    },
    name: String, 
    email: String,
    mobile: String,
    course: String,
    branch: String, 
    semester: String,
    image: String,
    password: String
});

module.exports = mongoose.model('Student', studentSchema);