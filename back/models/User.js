const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  _id: { type: String , required: true},
  catches: { type: Array, required: true },
  achievements: { type : Array, required : false}
}, { timestamps: false }, { _id: false });

module.exports = mongoose.model("User", userSchema);