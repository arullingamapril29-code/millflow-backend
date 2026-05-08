const express = require("express");
const router = express.Router();

const Invoice = require("../models/Invoice");
const Production = require("../models/Production");

router.get("/", async (req, res) => {
  try {
    const { date, month } = req.query;

    const invoices = await Invoice.find();
    const productions = await Production.find();

    let filteredInvoices = invoices;
    let filteredProductions = productions;

    // 📅 DAY FILTER
    if (date) {
      filteredInvoices = filteredInvoices.filter(i =>
        new Date(i.date).toISOString().split("T")[0] === date
      );

      filteredProductions = filteredProductions.filter(p =>
        new Date(p.date).toISOString().split("T")[0] === date
      );
    }

    // 📆 MONTH FILTER
    if (month) {
      filteredInvoices = filteredInvoices.filter(i =>
        new Date(i.date).getMonth() + 1 == month
      );

      filteredProductions = filteredProductions.filter(p =>
        new Date(p.date).getMonth() + 1 == month
      );
    }

    const income = filteredInvoices.reduce(
      (sum, i) => sum + (i.total || 0),
      0
    );

    const expense = filteredProductions.reduce(
      (sum, p) => sum + (p.cost || 0),
      0
    );

    const profit = income - expense;

    res.json({
      income,
      expense,
      profit,
      totalInvoices: filteredInvoices.length,
      totalProductions: filteredProductions.length
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;