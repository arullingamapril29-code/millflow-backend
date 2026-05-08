const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ✅ REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // 🔴 VALIDATION
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields required ❌" });
    }

    // 🔴 CHECK EXISTING USER
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered ❌" });
    }

    // 🔐 HASH
    const hash = await bcrypt.hash(password, 10);

    // ✅ CREATE USER
    const user = new User({
      name,
      email,
      password: hash,
      role: role || "staff"
    });

    await user.save();

    res.json({ message: "Registered ✅" });

  } catch (err) {
    console.log("REGISTER ERROR 👉", err); // 🔥 IMPORTANT
    res.status(500).json({ error: err.message });
  }
});


// ✅ LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Missing fields ❌" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: "User not found ❌" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({ error: "Wrong password ❌" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      "SECRET_KEY",
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        name: user.name,
        role: user.role
      }
    });

  } catch (err) {
    console.log("LOGIN ERROR 👉", err); // 🔥 IMPORTANT
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;