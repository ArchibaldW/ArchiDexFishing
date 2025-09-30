const mongoose = require("mongoose");

const catchSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  shiny: { type: Boolean, required: true }
}, { timestamps: false });

module.exports = mongoose.model("Catch", catchSchema);