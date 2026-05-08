const express = require("express");
const router = express.Router();

const Production = require("../models/Production");
const Inventory = require("../models/Inventory");

/* =========================
   CREATE PRODUCTION
========================= */
router.post("/", async (req, res) => {
  try {
    const { material, usedQty, outputQty } = req.body;

    const product = await Inventory.findOne({
      name: { $regex: new RegExp("^" + material + "$", "i") }
    });

    if (!product) {
      return res.status(404).json({ message: "Material not found" });
    }

    if (!product.price) {
      return res.status(400).json({ message: "Price not set in inventory" });
    }

    if (product.quantity < usedQty) {
      return res.status(400).json({ message: "Not enough stock" });
    }

    const cost = product.price * usedQty;

    // reduce stock
    product.quantity -= usedQty;
    await product.save();

    const newProduction = new Production({
      material,
      usedQty,
      outputQty,
      cost
    });

    await newProduction.save();

    res.json({
      ...newProduction._doc,
      remainingStock: product.quantity
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* =========================
   GET ALL PRODUCTION
========================= */
router.get("/", async (req, res) => {
  try {
    const data = await Production.find().sort({ date: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* =========================
   DELETE PRODUCTION (FULL SAFE)
========================= */
router.delete("/:id", async (req, res) => {
  try {
    const production = await Production.findById(req.params.id);

    if (!production) {
      return res.status(404).json({ message: "Production not found" });
    }

    // restore stock back
    const product = await Inventory.findOne({
      name: { $regex: new RegExp("^" + production.material + "$", "i") }
    });

    if (product) {
      product.quantity += production.usedQty;
      await product.save();
    }

    await Production.findByIdAndDelete(req.params.id);

    res.json({ message: "Deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;