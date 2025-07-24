const express = require("express");
const router = express.Router();
const ratingController = require("../controllers/ratingController");
const auth = require("../middlewares/authmiddleware");

router.post("/:storeId", auth(["user"]), ratingController.submitOrUpdateRating);

router.get("/my-ratings", auth(["user"]), ratingController.getUserRatings);

module.exports = router;
