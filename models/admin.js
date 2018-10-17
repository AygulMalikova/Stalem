const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
const uniqueValidator = require("mongoose-unique-validator");
const bcrypt = require("bcrypt");

const AdminSchema = new Schema({
    username: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true }
});

AdminSchema.plugin(uniqueValidator);

AdminSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.passwordHash, function (err) {
        if (err) {
            console.error('ERROR!');
        }
    });
};

AdminSchema.virtual("password").set(function(value) {
    this.passwordHash = bcrypt.hashSync(value, 12);
});

const Admin = mongoose.model("Admin", AdminSchema);

module.exports = Admin;