const express = require("express");
const verifyToken = require("../middleware/authMiddleware");
const {
  createMessage,
  fetchMessages,
} = require("../controllers/messageControllers");

const router = express.Router();

router.post("/", verifyToken, createMessage);
router.get("/:id", verifyToken, fetchMessages);

module.exports = router;
