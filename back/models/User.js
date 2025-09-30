const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  pseudo: { type: String, required: true, unique: true },
  catches: { type: Array, required: true }
}, { timestamps: false });

module.exports = mongoose.model("User", userSchema);