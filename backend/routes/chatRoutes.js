//These routes is used for user chats.

const express = require("express");
const { protect } = require("../Middleware/authMiddleware");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
} = require("../controllers/chatControllers");

const router = express.Router();

//These are all the endpoints for the group chat.

router.route("/").post(protect, accessChat); //These route is for access the chat or creating the chat. It gone have a protect middleware(Only logged user's have access for it). The accessChat is a file where we can access the chat using post request.From controllers folder => chatControllers.js file.

router.route("/").get(protect, fetchChats); //These route will get all the chat from the database. And it will display all the chat's for that particular logged in user. It gone have a protect middleware(Only logged user's have access for it). The fetchChats is a file where we can get all the chats from mongoDB using get request.

router.route("/group").post(protect, createGroupChat); //These route is for create the group chat. It gone have a protect middleware(Only logged user's have access for it). The createGroupChat is a file where we can create group chat using post request.

router.route("/rename").put(protect, renameGroup); //These route is for rename the group chat. It gone have a protect middleware(Only logged user's have access for it). The renameGroup is a file where we can rename group chat using put request.

router.route("/groupadd").put(protect, addToGroup); //These route is for to add an new user to the group chat. It gone have a protect middleware(Only logged user's have access for it). The addToGroup is a file where we can add an user to the group chat using put request.

router.route("/groupremove").put(protect, removeFromGroup); //These route is for remove the user from the group chat. It gone have a protect middleware(Only logged user's have access for it). The removeFromGroup is a file where we can remove the user from the group chat using put request.

module.exports = router; //The router variable will have all the above endpoints in it.
