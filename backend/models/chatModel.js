const mongoose = require("mongoose");
const { Schema } = mongoose;

// Create a schema instance using Schema constructor
// Schema is like table structure in RDBMS
// Schema is equivalent to collections
// latestMessage: { type: Schema.Types.ObjectId, ref: "Message" } -> It is like foreign key mapping RDBMS.Refers to unique _id on Message model
const chatSchema = new Schema(
  {
    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    users: [{ type: Schema.Types.ObjectId, ref: "User" }],
    latestMessage: { type: Schema.Types.ObjectId, ref: "Message" },
    groupAdmin: { type: Schema.Types.ObjectId, ref: "User" },
  },
  // The timestamps option tells mongoose to assign createdAt and updatedAt fields to your schema. The type assigned is Date.
  { timestamps: true }
);

// Compile model from schema
// The first argument is the singular name of the collection your model is for
const Chat = mongoose.model("Chat", chatSchema);

// Exporting Chat as module so that it can be imported in other files and used
module.exports = Chat;
