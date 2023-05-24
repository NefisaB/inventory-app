const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
    name: { type: String, required: true, maxLength: 100 },
    description: { type: String, required: true },
    category: [{ type: Schema.Types.ObjectId, ref: "Category" }],
    price: { type: Number, required: true },
    numberInStock: { type: Number, required: true },
    image: {type: String, required: true}
});

// Virtual property for item's URL 
ItemSchema.virtual("url").get(function () {
    return `/catalog/item/${this._id}`;
});

// Export module
module.exports = mongoose.model("Item", ItemSchema);