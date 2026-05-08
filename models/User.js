const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,

  email: {
    type: String,
    unique: true
  },

  password: String,

  role: {
    type: String,
    enum: ["admin", "staff"], // 🔥 IMPORTANT
    default: "staff"
  }
});

module.exports = mongoose.model("User", userSchema);