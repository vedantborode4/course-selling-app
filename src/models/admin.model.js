const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
{
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        trim: true,
    },
},
{
    timestamps: true
})

const Admin = mongoose.model("Admin", adminSchema)
exports.Admin = Admin;