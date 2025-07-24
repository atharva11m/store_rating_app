const db = require("../config/db");
const bcrypt = require("bcrypt");

exports.getAllUsers = async (req, res) => {
  const { name, email, address, role } = req.query;

  let query = "SELECT id, name, email, address, role FROM users WHERE 1=1";
  const params = [];

  if (name) {
    query += " AND name LIKE ?";
    params.push(`%${name}%`);
  }
  if (email) {
    query += " AND email LIKE ?";
    params.push(`%${email}%`);
  }
  if (address) {
    query += " AND address LIKE ?";
    params.push(`%${address}%`);
  }
  if (role) {
    query += " AND role = ?";
    params.push(role);
  }

  try {
    const [users] = await db.query(query, params);
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserById = async (req, res) => {
  const id = req.params.id;

  try {
    const [users] = await db.query(
      "SELECT id, name, email, address, role FROM users WHERE id = ?",
      [id]
    );
    if (!users.length)
      return res.status(404).json({ message: "User not found" });

    const user = users[0];

    if (user.role === "owner") {
      const [avg] = await db.query(
        `SELECT ROUND(AVG(r.rating), 1) as avg_rating
          FROM ratings r
          JOIN stores s ON r.store_id = s.id
          WHERE s.owner_id = ?`,
        [id]
      );
      user.avg_rating = avg[0].avg_rating || 0;
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updatePassword = async (req, res) => {
  const userId = req.user.id;
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword)
    return res
      .status(400)
      .json({ message: "Both old and new password are required" });

  try {
    const [rows] = await db.query("SELECT password FROM users WHERE id = ?", [
      userId,
    ]);
    if (!rows.length)
      return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(oldPassword, rows[0].password);
    if (!isMatch)
      return res.status(401).json({ message: "Incorrect old password" });

    const hashed = await bcrypt.hash(newPassword, 10);
    await db.query("UPDATE users SET password = ? WHERE id = ?", [
      hashed,
      userId,
    ]);

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const [[userCount]] = await db.query(
      `SELECT COUNT(*) as total_users FROM users`
    );
    const [[storeCount]] = await db.query(
      `SELECT COUNT(*) as total_stores FROM stores`
    );
    const [[ratingCount]] = await db.query(
      `SELECT COUNT(*) as total_ratings FROM ratings`
    );

    res.json({
      total_users: userCount.total_users,
      total_stores: storeCount.total_stores,
      total_ratings: ratingCount.total_ratings,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
