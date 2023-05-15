const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    name: { type: String, required: true, maxLength: 100 },
    description: { type: String, required: true },
    itemsInCategory: [Schema.Types.Item]
});


// Virtual property for category's URL
CategorySchema.virtual("url").get(function () {
    return `/categories/${this._id}`;
});

// Export module
module.exports = mongoose.model("Category", CategorySchema);