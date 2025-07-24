const db = require("../config/db");

exports.addStore = async (req, res) => {
  const { name, email, address } = req.body;
  const owner_id = req.user.id;

  try {
    await db.query(
      "INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)",
      [name, email, address, owner_id]
    );
    res.status(201).json({ message: "Store added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllStores = async (req, res) => {
  const { search } = req.query;
  const userId = req.user.id;

  try {
    let query = `
      SELECT 
        s.*, 
        COALESCE(AVG(r.rating), 0) AS average_rating,
        MAX(CASE WHEN r.user_id = ? THEN r.rating ELSE NULL END) AS user_rating
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
    `;
    const params = [userId];

    if (search) {
      query += ` WHERE s.name LIKE ? OR s.address LIKE ?`;
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ` GROUP BY s.id`;

    const [stores] = await db.query(query, params);
    res.json(stores);
  } catch (err) {
    console.error("Error fetching stores:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
exports.getMyStores = async (req, res) => {
  try {
    const stores = await Store.findAll({ where: { owner_id: req.user.id } });
    res.json(stores);
  } catch (err) {
    console.error("Error fetching owner's stores:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getStoresWithRatings = async (req, res) => {
  try {
    const [stores] = await db.query(`
      SELECT s.id, s.name, s.email, s.address,
             u.name AS owner_name, u.email AS owner_email,
             ROUND(AVG(r.rating), 1) AS avg_rating
      FROM stores s
      JOIN users u ON s.owner_id = u.id
      LEFT JOIN ratings r ON s.id = r.store_id
      GROUP BY s.id
    `);

    res.json(stores);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOwnerDashboard = async (req, res) => {
  const ownerId = req.user.id;

  try {
    const [store] = await db.query("SELECT id FROM stores WHERE owner_id = ?", [
      ownerId,
    ]);
    if (!store.length)
      return res.status(404).json({ message: "No store found for this owner" });

    const storeId = store[0].id;

    const [ratings] = await db.query(
      `
      SELECT u.name, u.email, r.rating, r.created_at
      FROM ratings r
      JOIN users u ON r.user_id = u.id
      WHERE r.store_id = ?
    `,
      [storeId]
    );

    const [avg] = await db.query(
      `SELECT ROUND(AVG(rating), 1) AS average_rating FROM ratings WHERE store_id = ?`,
      [storeId]
    );

    res.json({
      average_rating: avg[0].average_rating || 0,
      ratings,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
