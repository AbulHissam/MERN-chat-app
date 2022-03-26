const User = require("../models/userModel");
const generateToken = require("../config/generateToken");

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, pic } = req.body;

    if (!name || !email || !password) {
      throw new Error("name or email or password is missing");
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      throw new Error("User already exists");
    }

    const user = await User.create({
      name,
      email,
      password,
      pic,
    });
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        pic: user.pic,
        token: generateToken(user._id),
      });
    } else {
      throw new Error("Failed to create user");
    }
  } catch (err) {
    // For errors returned from asynchronous functions invoked by route handlers and middleware, you must pass them to the next() function, where Express will catch and process them
    res.status(400).json({
      error: err.message,
    });
    next(err);
  }
};

const authenticateUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new Error("email or password is missing");
    }

    const user = await User.findOne({ email });

    // instance method of model
    // definition is in userModel.js.used to check if the entered password matches the password in db
    const passwordMatches = await user.checkPassword(password);

    if (user && passwordMatches) {
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        pic: user.pic,
        token: generateToken(user._id),
      });
    } else {
      throw new Error("Invalid email or password");
    }
  } catch (err) {
    console.log(err.message);
    res.status(400).json({
      error: err.message,
    });
    next(err);
  }
};

const searchUsers = async (req, res, next) => {
  try {
    const { q } = req.query;
    let matchedUsers = [];

    if (q) {
      // find users with name or email like 'q' except current user(req.user.id)and options:'i' -> Case insensitivity to match upper and lower cases
      matchedUsers = await User.find({
        $or: [
          { name: { $regex: q, $options: "i" } },
          { email: { $regex: q, $options: "i" } },
        ],
      }).find({ _id: { $ne: req.user.id } });
    } else {
      // return all users except the current user(req.user.id).refer->middleware/authMiddleware.js
      matchedUsers = await User.find({ _id: { $ne: req.user.id } });
    }
    res.status(200).json({
      total: matchedUsers.length,
      result: matchedUsers,
    });
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
    next(err);
  }
};
module.exports = { registerUser, authenticateUser, searchUsers };
