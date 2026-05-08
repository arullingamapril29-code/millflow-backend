const router = require("express").Router();
const Worker = require("../models/Worker");


// ✅ GET ALL WORKERS
router.get("/", async (req, res) => {
  const workers = await Worker.find();
  res.json(workers);
});


// ✅ ADD WORKER
router.post("/add", async (req, res) => {
  const worker = new Worker({
    name: req.body.name,
    wage: req.body.wage,
    attendance: []
  });

  await worker.save();
  res.json(worker);
});


// ✅ MARK ATTENDANCE
router.put("/attendance/:id", async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id);

    if (!worker) {
      return res.status(404).json({ error: "Worker not found" });
    }

    // 🔥 FORCE FIX
    if (!Array.isArray(worker.attendance)) {
      worker.attendance = [];
    }

    const status = req.body.status;

    if (!status) {
      return res.status(400).json({ error: "Status missing" });
    }

    worker.attendance.push({
      date: new Date(),
      status
    });

    await worker.save();

    res.json({ message: "Attendance saved ✅" });

  } catch (err) {
    console.log("🔥 ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});
router.get("/monthly", async (req, res) => {
  const { month, year } = req.query;

  const workers = await Worker.find();

  const report = workers.map((w) => {
    const records = w.attendance.filter((a) => {
      const d = new Date(a.date);
      return (
        d.getMonth() + 1 === Number(month) &&
        d.getFullYear() === Number(year)
      );
    });

    const presentDays = records.filter(
      (r) => r.status === "present"
    ).length;

    const totalSalary = presentDays * (w.wage || 0);

    return {
      name: w.name,
      presentDays,
      totalSalary
    };
  });

  res.json(report);
});

// ✅ DELETE WORKER
router.delete("/:id", async (req, res) => {
  try {
    await Worker.findByIdAndDelete(req.params.id);
    res.json({ message: "Worker deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete worker" });
  }
});

module.exports = router;