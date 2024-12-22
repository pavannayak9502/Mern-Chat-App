const asyncHandler = require("express-async-handler");
const Chat = require("../Models/chatModel");
const User = require("../Models/userModel");

//The accessChat route post method is used to create the chat for group chat or fetching 1:1 chat.
const accessChat = asyncHandler(async (req, res) => {
  var { userId } = req.body; //Current logged in user can have access to send an id(Taking complete req.body the body will contain userId). User can create an group chat & 1:1 chat.

  if (!userId) {
    //If userId param does't exists in the request show the error.
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }

  //If this chat exist with userId.
  var isChat = await Chat.find({
    isGroupChat: false, //groupChat shoud be false in these field.
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  //The sender
  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  //If chat exists then send the response else create the chat.
  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    //If chat does't exists with searched user then create the chat between them only 1:1 chat.
    const chatData = {
      //Creating an object with properties and values.
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId], //Passing an array values of logged in user and searched user.
    };

    try {
      //Creating the 1:1 chat.

      const createdChat = await Chat.create(chatData); //The chat has been create next we need send it to user.

      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      ); //We are finding the createdchat(logged in user and new user) object id and then populate the users array with out password.

      res.status(200).send(FullChat); //After creating and finding the new chat send the response.
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});

//The fetchChats route get method is used for to fetch all the chats for particular logged in query from the database.
const fetchChats = asyncHandler(async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } }) //Find the current logged in user id and fetchs his from the database.
      .populate("users", "-password") //The list of users array he had chat with them iether 1:1chat or group chat, fetch the data from database.
      .populate("groupAdmin", "-password") //The chats from groupchat, fetch from database.
      .populate("latestMessage") //Display the latest message to the user, fetch from the database.
      .sort({ updatedAt: -1 }) //Display messages from new to old messages using mongodb sort query.

      .then(async (results) => {
        //Show the latest message from the sender to the current logged in user.
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name pic email",
        });

        res.status(200).send(results); //Send the latest messages to the current logged in user.
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//The createGroupChat route post method is used for to create the group chat.
const createGroupChat = asyncHandler(async (req, res) => {
  //We are taking the bunch of userId from the body, and taking the name of that user.

  if (!req.body.users || !req.body.name) {
    //If current logged in user does't provided any of name or id then display the error message.
    return res.status(400).send({ message: "Please fill all the fields." });
  }

  var users = JSON.parse(req.body.users); //We are talking req.users array from our body.

  if (users.length < 2) {
    //In group chat the user length & members should be more than 2 members then only group chat will be created.
    return res
      .status(400)
      .send("More than 2 users are required to form a group chat");
  }

  users.push(req.user); //Added current logged group admin to the chat group.

  try {
    const groupChat = await Chat.create({
      //After filing the above fields then the create the group chat for them.
      chatName: req.body.name, //ChatName will be provided by the group admin.
      users: users, //Passing the users array.
      isGroupChat: true, //True for group chat.
      groupAdmin: req.user, //Display the group admin for the group chat.
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id }) //Using groupChat id we are fetching all users and their chat from the database.
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//The renameGroup route put method is used for to update the group name.
const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body; //We are taking chatId and chatName from the request body,

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    { chatName },
    { new: true }
  ) //Using mongodb findByIdAndUpdate query we are passing the groupchat id and chatName and updating as true for rename the group chat.
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(400);
    throw new Error("Chat Not Found");
  } else {
    res.json(updatedChat);
  }
});

//The addToGroup route put method is used for to add a new member to the chat group.
const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body; //Taking the chatId(group chat) and new user id from the request body.

  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      //Using mongodb findByIdAndUpdate query we are passing the group chat id.
      $push: { users: userId }, //After that we are new user(userId) pushing into chat users array after that we are upating it as true.
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!added) {
    //If no new user added to the group chat display the error.
    res.status(404);
    throw new Error("Chat not found");
  } else {
    res.json(added);
  }
});

//The removeFromogroup route put method is used for to remove a member from the chat group.
const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body; //Taking the chatId(group chat) and the remove user id from the request body.

  const removed = await Chat.findByIdAndUpdate(
    chatId, //Using mongodb findByIdAndUpdate query we are passing the group chat id.
    {
      $pull: { users: userId }, //After that user(userId) removing the user from users array group chat using the pull query from mongodb.
    },
    {
      new: true, //After removing the user from group chat we are updating(set) as true.
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removed) {
    //If no user deleted from group chat then display the error.
    res.status(400);
    throw new Error("Chat not found");
  } else {
    res.json(removed);
  }
});

module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
};
