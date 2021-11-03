const { Schema, model } = require("mongoose");

// Schema of contact list
const contactSchema = new Schema({
  name: {
    type: String,
    required: true,
    maxlength: 32,
    minlength: 3,
    trim: true,
  },
  email: {
    type: Array,
    default: [],
    trim: true,
  },
  phone: {
    type: Array,
    default: [],
    required: true,
    trim: true,
  },
});

// exporting the Schema
module.exports = model("contactListSchema", contactSchema);
