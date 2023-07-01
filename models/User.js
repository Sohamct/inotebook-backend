const mongoose = require('mongoose');
const {Schema} = mongoose;
const UserSchema = new Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    date : {
        type : Date,
        default : Date.now // it will call when user will not enter date(default).
    },
});
const User = mongoose.model('users', UserSchema);// (ModelNAme, nameofschema)
module.exports = User;