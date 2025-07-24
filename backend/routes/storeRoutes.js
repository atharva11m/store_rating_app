const express = require("express");
const router = express.Router();
const storeController = require("../controllers/storeController");
const auth = require("../middlewares/authmiddleware");

router.post("/", auth(["admin", "owner"]), storeController.addStore);

router.get("/", auth(["admin", "user"]), storeController.getAllStores);
router.get("/users/me", auth(["owner"]), (req, res) => {
  res.json({ name: req.user.name });
});

router.get(
  "/admin-view",
  auth(["admin"]),
  storeController.getStoresWithRatings
);

router.get(
  "/owner-dashboard",
  auth(["owner"]),
  storeController.getOwnerDashboard
);

module.exports = router;
