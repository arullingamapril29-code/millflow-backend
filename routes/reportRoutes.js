const router = require("express").Router();

const Production = require("../models/Production");
const Worker = require("../models/Worker");
const Inventory = require("../models/Inventory");
const Invoice = require("../models/Invoice");

router.get("/daily", async (req, res) => {
  try {

    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    // 📦 TODAY PRODUCTION
    const productions = await Production.find({
      date: { $gte: start, $lte: end }
    });

    // 👷 ALL WORKERS
    const workers = await Worker.find();

    // 🧾 TODAY SALES
    const invoices = await Invoice.find({
      createdAt: { $gte: start, $lte: end }
    });

    // 📦 INVENTORY
    const inventory = await Inventory.find();

    // 📦 TOTAL PRODUCTION
    const totalProduction = productions.reduce(
      (sum, p) => sum + (Number(p.outputQty) || 0),
      0
    );

    // 👷 PRESENT WORKERS
    let presentWorkers = 0;

    // 💰 TOTAL WAGES
    let totalWages = 0;

    workers.forEach((worker) => {

      if (worker.attendance && worker.attendance.length > 0) {

        const todayAttendance = worker.attendance.find((a) => {

          const attendanceDate =
            new Date(a.date).toLocaleDateString();

          const today =
            new Date().toLocaleDateString();

          return attendanceDate === today;

        });

        if (todayAttendance?.status === "present") {

          presentWorkers++;

          totalWages += Number(worker.wage || 0);

        }

      }

    });

    // 🧾 TOTAL SALES
    const totalSales = invoices.reduce(
      (sum, inv) => sum + (Number(inv.total) || 0),
      0
    );

    // 🚨 LOW STOCK
    const lowStock = inventory.filter(
      (i) => Number(i.quantity) <= Number(i.minLevel)
    );

    // ✅ RESPONSE
    res.json({
      date: start,

      totalProduction,
      presentWorkers,
      totalWages,
      totalSales,

      lowStockCount: lowStock.length,
      lowStockItems: lowStock
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: err.message
    });

  }
});

module.exports = router;