const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcryptjs");

// Create a schema instance using Schema constructor
// Schema is like table structure in RDBMS
// Schema is equivalent to collections
const userSchema = new Schema(
  {
    name: { type: "String", required: true },
    email: { type: "String", unique: true, required: true },
    password: { type: "String", required: true },
    pic: {
      type: "String",
      // required: true,
      // default:"https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  // The timestamps option tells mongoose to assign createdAt and updatedAt fields to your schema. The type assigned is Date.
  { timestamps: true }
);

// run this before saving a document
userSchema.pre("save", async function (next) {
  const user = this;
  try {
    // if password is modified or if it is a new document generate new hash else transfer the control to next process
    if (user.isModified("password") || user.isNew) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }
    next();
  } catch (err) {
    next(err);
  }
});

//we can attach custom methods to documents
// this is a method to check entered password and hashed password of a user
userSchema.methods.checkPassword = async function (enteredPassword) {
  const user = this;
  return bcrypt.compare(enteredPassword, user.password);
};

// Compile model from schema
// The first argument is the singular name of the collection your model is for
const User = mongoose.model("User", userSchema);

// Exporting Chat so that it can be imported in other files and used
module.exports = User;
