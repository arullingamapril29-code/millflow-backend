const mongoose = require("mongoose");

const productionSchema = new mongoose.Schema({
  material: {
    type: String,
    required: true
  },
  usedQty: {
    type: Number,
    required: true
  },
  outputQty: {
    type: Number,
    required: true
  },

  // 🔥 FIXED: cost field added
  cost: {
    type: Number,
    default: 0
  },

  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Production", productionSchema);