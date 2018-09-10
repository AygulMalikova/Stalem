const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PicturesSchema = new Schema({
    name: { type: String},
    description: { type: String},
    section: { type: String},
    imagePath: { type: String },
});

const Pictures = mongoose.model("Pictures", PicturesSchema);

module.exports = Pictures;