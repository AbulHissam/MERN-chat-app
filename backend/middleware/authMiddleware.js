const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const verifyToken = async (req, res, next) => {
  try {
    // destucture authorization from request headers
    const { authorization } = req.headers;

    // check if auth mechanism is valid
    if (authorization && authorization.startsWith("Bearer")) {
      const token = authorization.split(" ")[1];

      // verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // console.log(decoded);

      // from the decoded info find if there is a user with same id in the db and select("-password")->In the returned documents exclude password
      // adding verified user details to req so that we can use it to filter users
      req.user = await User.findById(decoded.id).select("-password");

      // handle the control to next middleware
      next();
    } else {
      res.status(401).json({
        error: "no or invalid authorization",
      });
      throw new Error("no or invalid authorization");
    }
  } catch (err) {
    res.status(401).json({
      error: "Failed to authorize user",
    });
    next(err);
  }
};

module.exports = verifyToken;
