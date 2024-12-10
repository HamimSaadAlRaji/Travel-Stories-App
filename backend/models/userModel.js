const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  fullname: { type: String, required: true }, // Ensure this field name is 'fullName' with uppercase N
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdOn: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
