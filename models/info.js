const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InfoSchema = new Schema({
    about: { type: String},
    vk: { type: String},
    telegram: { type: String},
    instagram: { type: String},
    developer: { type: String}
});

const Info = mongoose.model("Info", InfoSchema);

module.exports = Info;