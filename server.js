const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const productionRoutes = require("./routes/productionRoutes");
const alertRoutes = require("./routes/alertRoutes");
const profitRoutes = require("./routes/profitRoutes");
const financeRoutes = require("./routes/finance");



app.use(cors());
app.use(express.json());

// ✅ INVOICE ROUTE - WORKING
app.get("/api/invoices", async (req, res) => {
  try {
    const Invoice = require("./models/Invoice");
    const invoices = await Invoice.find().sort({ date: -1 });
    res.json(invoices);
  } catch (error) {
    res.json([]);
  }
});
app.use("/api/profit", profitRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/invoices", require("./routes/invoiceRoutes"));
app.use("/api/inventory", require("./routes/inventoryRoutes"));
app.use('/api/whatsapp', require('./routes/whatsappRoutes'));
app.use("/api/production", require("./routes/productionRoutes"));
app.use("/api/workers", require("./routes/workerRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/report", require("./routes/reportRoutes"));

app.use("/api/finance", financeRoutes);


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});