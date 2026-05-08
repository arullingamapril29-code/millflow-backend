const mongoose = require("mongoose");

const workerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  wage: {
    type: Number,
    required: true
  },

  // 🔥 VERY IMPORTANT
  attendance: [
    {
      date: {
        type: Date,
        default: Date.now
      },
      status: {
        type: String,
        enum: ["present", "absent"], // 🔥 FIX
        required: true
      }
    }
  ]
});

module.exports = mongoose.model("Worker", workerSchema);