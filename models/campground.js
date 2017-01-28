var mongoose = require("mongoose");
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    //assciating the user with campgrounds
    author:{
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User" // the model we refer to the object id
        },
        username: String
    },
    //associatng the comment with campgrounds
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:  "Comment"    //name of model
        }
    ]
});
//compile schema into model
module.exports = mongoose.model("Campground", campgroundSchema);