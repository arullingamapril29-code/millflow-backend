const mongoose = require("mongoose");

const InventorySchema = new mongoose.Schema({
  name: String,
  quantity: Number,
  minLevel: Number,
  price: { type: Number, default: 0 }
});

// 🔥 IMPORTANT FIX
module.exports =
  mongoose.models.Inventory ||
  mongoose.model("Inventory", InventorySchema);