const mongoose = require("mongoose");


const userSChema = new mongoose.Schema({
    username: {
        type: String,
        unique: [ true, "Username already exists." ],
        required: true,
    },
    email: {
        type: String,
        unique: [ true, "Account already exists with this email address." ],
        required: true,
    },
    password: {
        type: String,
        required: true,
    }
})


const userModel = mongoose.model("users", userSChema)


module.exports = userModel