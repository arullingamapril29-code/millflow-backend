const router = require("express").Router();
const Inventory = require("../models/Inventory");
const Worker = require("../models/Worker");
const Production = require("../models/Production");

router.get("/", async (req, res) => {
  try {
    const alerts = [];

    // 📦 LOW STOCK
    const lowStock = await Inventory.find({ quantity: { $lt: 50 } });

    lowStock.forEach((item) => {
      alerts.push({
        type: "stock",
        message: `${item.name} low stock (${item.quantity})`
      });
    });

    // 👷 NO WORKERS TODAY
    const workers = await Worker.find();

    const today = new Date().toDateString();

    let presentCount = 0;

    workers.forEach((w) => {
      if (Array.isArray(w.attendance)) {
        w.attendance.forEach((a) => {
          if (
            new Date(a.date).toDateString() === today &&
            a.status === "present"
          ) {
            presentCount++;
          }
        });
      }
    });

    if (presentCount === 0) {
      alerts.push({
        type: "worker",
        message: "No workers present today"
      });
    }

    // 🏭 LOW PRODUCTION
    const todayProduction = await Production.find();

    const todayTotal = todayProduction
      .filter(
        (p) =>
          new Date(p.date).toDateString() === today
      )
      .reduce((sum, p) => sum + Number(p.outputQty || 0), 0);

    if (todayTotal < 100) {
      alerts.push({
        type: "production",
        message: `Low production today (${todayTotal} kg)`
      });
    }

    res.json(alerts);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;