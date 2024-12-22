const asyncHandler = require("express-async-handler");
const Message = require("../Models/messageModel.js");
const User = require("../Models/userModel.js");
const Chat = require("../Models/chatModel.js");

const sendMessage = asyncHandler(async (req, res) => {
  // Three requirements needed: 1.Chat id on which chat we need to send the message., 2.The Actuall message itself., 3.Who is the sender of the message => and we will take the sender from protect middleware(authMiddleware.js file) which means current logged in sender id.
  //Imp : We need to pass the chatId of 1:1 chat main id & group chat main id for sending the messages. Not an userid of that chat.

  const { content, chatId } = req.body; //The fisrt(chatID) and second(Actual message) requirements we are taking from body.

  if (!content || !chatId) {
    //If no message content or no chatId for that message means display the error.
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  const newMessage = {
    //In newMessage variable we are creating the object three properties and their values.
    sender: req.user._id, //The current logged sender id.
    content: content, //The actual message of that content.
    chat: chatId, //The chatId for that message.
  };

  try {
    //Querying our database.

    var message = await Message.create(newMessage); //Creating and storing the newMessage var variable into our Message model and then storing into our database.

    message = await message.populate("sender", "name pic"); //What I am having in var message variable I am going to populate the sender of that message.

    message = await message.populate("chat"); //What I am having in var message variable I am going to populate the content of that message.

    message = await User.populate(message, {
      //For path we need to populate the each of the user from chatModel(users array) and then select their name, pic, email from (userModel). And finally we are populating every(chat, content, users, name, pic, email) thing in the message variable into our database.
      path: "chat.users",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, {
      //Find by id and update the chat with latest Message( the latestMessage property is from ChatModel.js file) and then store the latest messgae to var message variable into our database.
      latestMessage: message,
    });

    res.json(message); //Passing my var message variable object into json response.
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const allMessages = asyncHandler(async (req, res) => {
  try {
    //Here I am fetching all the messages for a particular chat.

    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat"); //(req.params(id).chatId) We are finding the particular chat from database using the chatId and then populating the message sender and his name, pic,email and overall populating the chat.

    res.json(messages); //After finding the particular chat from that chatId from database then pass the particular messages(chat) data into json response.
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = { sendMessage, allMessages };
