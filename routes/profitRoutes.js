const express = require("express");
const router = express.Router();

const Invoice = require("../models/Invoice");
const Production = require("../models/Production");

// 📊 GET PROFIT DATA
router.get("/", async (req, res) => {
  try {
    const invoices = await Invoice.find();
    const productions = await Production.find();

    // 💰 Income (Invoice total)
    const income = invoices.reduce((sum, inv) => sum + (inv.total || 0), 0);

    // 💸 Expense (Production cost)
    const expense = productions.reduce((sum, p) => sum + (p.totalCost || 0), 0);

    // 📈 Profit
    const profit = income - expense;

    res.json({
      income,
      expense,
      profit,
      totalInvoices: invoices.length,
      totalProductions: productions.length
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;