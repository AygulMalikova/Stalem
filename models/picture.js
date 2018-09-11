const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PicturesSchema = new Schema({
    name: { type: String},
    description: { type: String},
    section:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Sections"
        },
    imagePath: { type: String },
});

const Pictures = mongoose.model("Pictures", PicturesSchema);

module.exports = Pictures;