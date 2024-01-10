const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const authoritySchema = mongoose.Schema({
    // Existing fields
    password: String,
    name: String,
    email: String,
    phoneNumber: String,
    district: String,
    policeStation:String,
    post: String,
    
});

authoritySchema.plugin(passportLocalMongoose, { usernameField: 'email' });

module.exports = mongoose.model("Admins", authoritySchema);