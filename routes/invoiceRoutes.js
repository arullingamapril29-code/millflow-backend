const express = require("express");
const router = express.Router();
const mongoose = require("mongoose"); 
const Invoice = require("../models/Invoice");
const Inventory = require("../models/Inventory");
// ✅ GET ALL INVOICES
router.get("/", async (req, res) => {
  try {
    const invoices = await Invoice.find().sort({ date: -1 });
    res.json(invoices);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
});
router.get("/:id", async (req, res) => {
  try {
    // Remove surrounding double/single quotes, spaces, newlines
    let id = req.params.id.replace(/^["']|["']$/g, '').trim();
    console.log("Cleaned ID:", id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid invoice ID format" });
    }
    const invoice = await Invoice.findById(id);
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });
    res.json(invoice);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
router.post("/", async (req, res) => {
  try {
    const { customerName, customerPhone, items } = req.body;   // ✅ destructure phone

    let total = 0;
    let updatedItems = [];

    for (let item of items) {
      const product = await Inventory.findOne({ name: item.name });

      if (!product) {
        return res.status(404).json({ message: `${item.name} not found` });
      }

      if (product.quantity < item.qty) {
        return res.status(400). json({ message: `Not enough stock for ${item.name}. Available: ${product.quantity}` });
      }

      product.quantity -= item.qty;
      await product.save();

      const itemTotal = item.qty * item.price;
      total += itemTotal;

      const isLow = product.quantity <= 10;

      updatedItems.push({
        name: item.name,
        qty: item.qty,
        price: item.price,
        total: itemTotal,
        balance: product.quantity,
        lowStock: isLow
      });
    }

    const newInvoice = new Invoice({
      customerName,
      customerPhone: customerPhone || "",   // ✅ add phone
      items: updatedItems,
      total,
      date: new Date()
    });

    const savedInvoice = await newInvoice.save();
    res.status(201).json(savedInvoice);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
});
// ✅ DELETE INVOICE
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id.trim();

    const deleted = await Invoice.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.json({ message: "Invoice deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;