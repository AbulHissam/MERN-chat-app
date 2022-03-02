const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB:", conn.connection.host);
  } catch (err) {
    console.log(err);
    // When Node.js runs this line, the process is immediately forced to terminate.
    // when connecting to DB fails we are stopping the process
    process.exit();
  }
};

module.exports = connectDB;
