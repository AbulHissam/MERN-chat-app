const jwt = require("jsonwebtoken");

// i generated just a random jwt secret in .env file,no logic in it.Commenting here since not able to connect in .env
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

module.exports = generateToken;
