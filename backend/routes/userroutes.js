const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middlewares/authmiddleware");

router.get("/", auth(["admin"]), userController.getAllUsers);

router.get("/:id", auth(["admin"]), userController.getUserById);

router.put(
  "/update-password",
  auth(["admin", "user", "owner"]),
  userController.updatePassword
);

router.get(
  "/dashboard-stats",
  auth(["admin"]),
  userController.getDashboardStats
);

module.exports = router;
