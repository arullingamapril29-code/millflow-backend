
const Inventory = require("../models/Inventory");

console.log("🔥 INVOICE ROUTES FILE IS BEING LOADED");
const express = require("express");
const router = express.Router();
// ... rest of code
// 📄 GET ALL
router.get("/", async (req, res) => {
  const items = await Inventory.find();
  res.json(items);
});


// 📉 LOW STOCK
router.get("/low-stock", async (req, res) => {
  const items = await Inventory.find();
  const low = items.filter(i => i.quantity <= i.minLevel);
  res.json(low);
});


// ➕ CREATE
router.post("/", async (req, res) => {
  try {
    const { name, quantity, minLevel, price } = req.body;

    console.log("BODY:", req.body); // 🔥 DEBUG

    const item = new Inventory({
      name,
      quantity: Number(quantity) || 0,
      minLevel: Number(minLevel) || 0,
      price: Number(price) || 0
    });

    await item.save();
    res.status(201).json(item);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✏️ UPDATE
router.put("/:id", async (req, res) => {
  try {
    const { name, quantity, minLevel, price } = req.body;

    const updated = await Inventory.findByIdAndUpdate(
      req.params.id,
      {
        name,
        quantity: Number(quantity) || 0,
        minLevel: Number(minLevel) || 0,
        price: Number(price) || 0
      },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 🗑️ DELETE
router.delete("/:id", async (req, res) => {
  try {
    await Inventory.findByIdAndDelete(req.params.id);
    res.json({ msg: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;