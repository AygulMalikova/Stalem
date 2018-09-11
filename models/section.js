const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SectionSchema = new Schema({
    name: { type: String},
    description: { type: String},
    pictures:
        [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Pictures"
            }
            ]
});

const Sections = mongoose.model("Sections", SectionSchema);

module.exports = Sections;