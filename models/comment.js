const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentsSchema = new Schema({
    author: { type: String},
    text: { type: String},
    data: {type: Date,
        default: Date.now
    },
    picture:
        {
            type: Schema.Types.ObjectId,
            ref: "Pictures"
        }
});

const Comments = mongoose.model("Comments", CommentsSchema);

module.exports = Comments;