//User login and registration routes.

const express = require("express");
const {
  registerUser,
  authUser,
  allUsers,
} = require("../controllers/userControllers.js");
const { protect } = require("../Middleware/authMiddleware.js");

//Creating an instance of router form the express.
const router = express.Router();

//For multiple request instead of using get & post method we can use route method.

router.route("/").post(registerUser).get(protect, allUsers); //registerUser is an function we are taking the logic from controllers folder userControllers.js file.

router.post("/login", authUser); //authUser is an function we are taking the logic from controllers folder userControllers.js file.

router.route("/").get(protect, allUsers); //Creating an get method api to get all the user from the database. (user searching api endpoint). The allUsers is a function we are taking the logic from controllers folder userControllers.js file. The protect() before the allUsers() we want all searched users expect the person(user) who was login with jwt verify.

module.exports = router;
