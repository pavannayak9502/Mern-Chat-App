const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

/* 
    User Data : 1. Name, 2. Email, 3. Password, 4. User_picture
*/

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    pic: {
      type: String,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  //For checking the password === bcrypt password. This function was belongs to Controllers folder => userControllers.js file at line number 56. (authUser)function
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
  //Here we are hashing the user password before saving into the database. Pre means before saving.
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    console.log("Error : ", error);
    next(error); // Pass any error to the next middleware.
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
