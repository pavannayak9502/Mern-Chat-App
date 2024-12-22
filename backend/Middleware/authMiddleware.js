//User info using query. Ex: /api/user?search=pavan //We are taking the query from our api. (Instead of using a single param we are using query request).
//At here we want all searched users expect the person(user) who was login. (From controllers floder => userControllers.js file code line 81).
//Authoriztion middleware is used for is user login or not logined.

const jwt = require("jsonwebtoken");
const User = require("../Models/userModel.js");
const asyncHandler = require("express-async-handler");
const dotenv = require("dotenv");
dotenv.config();

const protect = asyncHandler(async (req, res, next) => {
  //Empty variable we are going to use it for store the jwt text value.
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      //Jwt token contains like this : token = Bearer abcdefghijklmnopqrstuvwxyz. (.split(" ")[1] means we are removing the Bearer and store the remaing text value jwt into token variable.)
      token = req.headers.authorization.split(" ")[1];

      //Decodes the jwt token id. (jwt.verify(passToken, secretKey));
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      //Declaring an user variable inside the req. Using mongodb syntax we are finding the verified user decoded._id.
      req.user = await User.findById(decoded.id);

      //If all works good then go onto next() operation.
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  //If no token then display the error message.
  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

module.exports = { protect };
