const mongoose = require("mongoose");
const { Schema } = mongoose;

// Create a schema instance using Schema constructor
// Schema is like table structure in RDBMS
// Schema is equivalent to collections
const messageSchema = new Schema(
  {
    sender: { type: Schema.Types.ObjectId, ref: "User" },
    content: { type: String, trim: true },
    chat: { type: Schema.Types.ObjectId, ref: "Chat" },
    readBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  // The timestamps option tells mongoose to assign createdAt and updatedAt fields to your schema. The type assigned is Date.
  { timestamps: true }
);

// Compile model from schema
// The first argument is the singular name of the collection your model is for
const Message = mongoose.model("Message", messageSchema);

// Exporting Chat so that it can be imported in other files and used
module.exports = Message;
