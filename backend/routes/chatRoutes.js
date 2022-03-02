const express = require("express");
const verifyToken = require("../middleware/authMiddleware");

const {
  accessChats,
  fetchChats,
  createGroupChat,
  renameGroup,
  removeFromGroup,
  addToGroup,
} = require("../controllers/chatController");

const router = express.Router();

router.post("/", verifyToken, accessChats);
router.get("/", verifyToken, fetchChats);
router.post("/group", verifyToken, createGroupChat);
router.put("/rename", verifyToken, renameGroup);
router.put("/groupremove", verifyToken, removeFromGroup);
router.put("/groupadd", verifyToken, addToGroup);

module.exports = router;
