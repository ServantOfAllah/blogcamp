var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

AdminSchema  = new mongoose.Schema({
    admin: String,
    password: String
});

AdminSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Admin", AdminSchema);