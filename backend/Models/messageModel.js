const mongoose = require("mongoose");

/*
1. Name of the sender & ID of that sender.
2. Content of the message.
3. References of the chat which it was belongs to.
*/

//Creating an messageModel of schema and inside schema we are storing the name, content, reference.
const messageModel = mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    content: { type: String, trim: true },

    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model("Message", messageModel);

module.exports = Message;
