const db = require("../config/db");

exports.submitOrUpdateRating = async (req, res) => {
  const storeId = req.params.storeId;
  const userId = req.user.id;
  const { rating } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: "Rating must be between 1 and 5" });
  }

  try {
    const [existing] = await db.query(
      "SELECT * FROM ratings WHERE user_id = ? AND store_id = ?",
      [userId, storeId]
    );

    if (existing.length) {
      await db.query(
        "UPDATE ratings SET rating = ?, updated_at = NOW() WHERE user_id = ? AND store_id = ?",
        [rating, userId, storeId]
      );
      return res.json({ message: "Rating updated" });
    } else {
      await db.query(
        "INSERT INTO ratings (user_id, store_id, rating, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())",
        [userId, storeId, rating]
      );
      return res.status(201).json({ message: "Rating submitted" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserRatings = async (req, res) => {
  const userId = req.user.id;

  try {
    const [ratings] = await db.query(
      `
      SELECT r.id, s.name AS store_name, s.address, r.rating, r.updated_at
      FROM ratings r
      JOIN stores s ON r.store_id = s.id
      WHERE r.user_id = ?
    `,
      [userId]
    );

    res.json(ratings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
