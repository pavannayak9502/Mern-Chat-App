const asyncHandler = require("express-async-handler");
const User = require("../Models/userModel.js");
const generateToken = require("../config/generateToken.js");

//npm install express-async-handler
//For this file we are import an package called async-handle, it will automatically check for the errors in the file.
//To use async-handler we need to wrap the complete function with open and closed brackets(). Ex: asyncHandler(async()=>{  });
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body; //We are destructing the data and taking all the body information from the register page.

  if (!name || !email || !password) {
    //If any details are missing from the body we are throwing an error. Pic was optional we have been already provided in Models folder => userModel.js file.
    res.status(400);
    throw new Error("Please Enter all the Fields");
  }

  const userExist = await User.findOne({ email }); //Checking if user already exist.
  if (userExist) {
    //If true then display the error that user already exists.
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    //User.create will query our database again it will create a new field(name, email, password, pic) for a new user.
    name,
    email,
    password,
    pic,
  });

  if (user) {
    //If true then the data for the above user.
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      // password: user.password,
      pic: user.pic,

      token: generateToken(user._id), //Using jwt we are storing the complete user._id data in a token. generateToken(user._id) is a function in that function we are passing the user id as parameter.
    });
  } else {
    res.status(400);
    throw new Error("Failed to Create the user");
  }
});

//For login authUser function.
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
});

//User info using query. Ex: /api/user?search=pavan //We are taking the query from our api. (Instead of using a single param we are using query request).
const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search //For user search results.
    ? {
        //Using mongodb regx(regular expression) to find the search details. $options:"i" means case sensitive to match lower & upper case letters.
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  //At here we want all searched users expect the person(user) who was login.
  const users = await User.find(keyword)
    .find({ _id: { $ne: req.user._id } })
    .select("-password"); //we are returning it without password
  res.send(users);
});

module.exports = { registerUser, authUser, allUsers };
