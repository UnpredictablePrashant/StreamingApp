const db = require('../util/conn')
const mongoose = require("../util/conn").mongoose;


const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
        unique: true,
        index: true
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        maxlength: 1000
    },
    verificationToken: {
        type: String,
        default: 'XXX'
    },
    verificationTokenStatus:{
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})


const User = mongoose.model('user', userSchema)
module.exports = { User }