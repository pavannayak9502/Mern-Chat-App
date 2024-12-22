//For messages routes.
const express = require("express");
const { protect } = require("../Middleware/authMiddleware");
const {
  sendMessage,
  allMessages,
} = require("../controllers/messageControllers");

const router = express.Router();

//We need two routes for messages => 1.Sending the messages, 2.Fetching all the messages in a particular chat.

router.route("/").post(protect, sendMessage); //The route must be protect(only logged user) and sening the messages using post request to store in the database for an particular message sending user. The sendMessage inside the route it's a controller we have imported it from controllers folder => messageControllers.js file.

router.route("/:chatId").get(protect, allMessages); //The route must be protect(only logged user) and fetching all the messages from database for that particular user using ther id(chat._id) using get request. The allMessages inside the route it's a controller we have imported it from controllers folder => messageControllers.js file.

module.exports = router;
