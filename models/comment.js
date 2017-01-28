var mongoose = require("mongoose");
var commentSchema = new mongoose.Schema({
    text: String,
    author:{
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User" // the model we refer to the object id
        },
        username: String
    }
});
//compile schema into model
module.exports = mongoose.model("Comment", commentSchema);