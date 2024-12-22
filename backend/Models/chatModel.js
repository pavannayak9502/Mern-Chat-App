// chatName
// isGroupChat
// users (no.of users)
// latestMessage
// groupAdmin

const mongoose = require("mongoose"); //Importing the mongoose package and stored it into a mongoose variable. ( npm install mongoose)

//Create mongoose schema.
const chatModel = new mongoose.Schema(
  {
    chatName: { type: String, trim: true },

    isGroupChat: { type: Boolean, default: false },

    users: [
      {
        //Storing user id for particular user
        type: mongoose.Schema.Types.ObjectId,

        //We are refering the user messages from the User model.
        ref: "User",
      },
    ],

    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,

      //We are refering the user messages from the User model.
      ref: "Message",
    },

    groupAdmin: {
      type: mongoose.Schema.Types.ObjectId,

      //We are refering the user messages from the User model.
      ref: "User",
    },
  },
  //When new dated added we are going to store the time stamp
  {
    timestamps: true,
  }
);

//Creating a model from the chatModel schema.
const Chat = mongoose.model("Chat", chatModel);

module.exports = Chat;
