const mongoose = require("mongoose");

const InvoiceSchema = new mongoose.Schema({
  customerName: String,
    customerPhone: { type: String, default: "" },
  items: Array,
  total: Number,
  date: {
    type: Date,
    default: Date.now
  }
});

// 🔥 FIX HERE TOO
module.exports =
  mongoose.models.Invoice ||
  mongoose.model("Invoice", InvoiceSchema);