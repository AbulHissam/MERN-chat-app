const express = require("express");
// creating an instance of router object
const router = express.Router();

const {
  registerUser,
  authenticateUser,
  searchUsers,
} = require("../controllers/userControllers");
const verifyToken = require("../middleware/authMiddleware");

//post: /api/user
router.post("/signup", registerUser);
router.post("/login", authenticateUser);
// we can provide multiple handlers and can call next() in them to hand over the control to next handler
// first verify the token and verifyToken will hand over the control to searchUsers if verification is success.
router.get("/", verifyToken, searchUsers);

module.exports = router;
