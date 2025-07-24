const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validateUser } = require("../utils/validators");

exports.register = async (req, res) => {
  const { name, email, address, password, role } = req.body;

  const validationErrors = validateUser({ name, email, address, password });
  if (validationErrors.length > 0) {
    return res.status(400).json({ errors: validationErrors });
  }

  if (!["user", "owner"].includes(role)) {
    return res.status(400).json({ message: "Invalid role selected." });
  }

  try {
    const [exists] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (exists.length)
      return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO users (name, email, address, password, role) VALUES (?, ?, ?, ?, ?)",
      [name, email, address, hashedPassword, role]
    );

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (!rows.length)
      return res.status(404).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, rows[0].password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: rows[0].id, role: rows[0].role, name: rows[0].name },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
