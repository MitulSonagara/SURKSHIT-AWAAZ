const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = mongoose.Schema({
    // Existing fields
    name: String,
    password: String,
    email: String,

    // New fields for password reset
    resetToken: String,
    resetTokenExpires: Date,
});

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });

module.exports = mongoose.model("User", userSchema);